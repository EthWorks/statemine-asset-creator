import { ApiRx, Keyring, WsProvider } from '@polkadot/api'
import { AugmentedEvent, SubmittableExtrinsic } from '@polkadot/api/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { Vec } from '@polkadot/types'
import { EventRecord, ExtrinsicStatus, Hash } from '@polkadot/types/interfaces'
import { combineLatest, concat, EMPTY, firstValueFrom, from, map, max, Observable, of, switchMap, tap } from 'rxjs'

import { Asset } from '../src'
import { waitFor } from './utils/waitFor'
import { ALICE } from './consts'
import {PalletAssetsAssetDetails} from "@polkadot/types/lookup";

const TIMEOUT = 100000
export function aliceSigner(): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' })

  return keyring.addFromUri('//Alice')
}
export async function execute(api: ApiRx, extrinsic: SubmittableExtrinsic<'rxjs'>, singer: KeyringPair, logger = { info: console.log }): Promise<void> {
  let currentTxDone = false

  function sendStatusCb({ events = [], status }: { events?: EventRecord[], status: ExtrinsicStatus; }) {
    if (status.isInvalid) {
      logger.info('Transaction invalid')
      currentTxDone = true
    } else if (status.isReady) {
      logger.info('Transaction is ready')
    } else if (status.isBroadcast) {
      logger.info('Transaction has been broadcasted')
    } else if (status.isInBlock) {
      logger.info('Transaction is in block')
    } else if (status.isFinalized) {
      logger.info(`Transaction has been included in blockHash ${status.asFinalized.toHex()}`)
      events.forEach(
        ({ event }) => {
          if (event.method === 'ExtrinsicSuccess') {
            logger.info('Transaction succeeded')
          } else if (api.events.system.ExtrinsicFailed.is(event)) {
            logger.info('Transaction failed')
            const [dispatchError] = event.data
            let errorInfo

            // decode the error
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              // (For specific known errors, we can also do a check against the
              // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
              const decoded = api.registry.findMetaError(dispatchError.asModule)

              errorInfo = `${decoded.section}.${decoded.name}`
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              errorInfo = dispatchError.toString()
            }

            logger.info(`:: ExtrinsicFailed:: ${errorInfo}`)
          }
        }
      )
      currentTxDone = true
    }
  }

  const a = extrinsic.signAndSend(singer)
  a.subscribe(sendStatusCb)
  await waitFor(() => currentTxDone, { timeout: TIMEOUT })
}

type EventCheck = AugmentedEvent<'promise'> | false | undefined | null;

function extractEvents(eventRecords: Vec<EventRecord>, checks: EventCheck[]): Observable<Hash> {
  const assetEvents = eventRecords.filter((record) =>
    record.event &&
        checks.some((check) => check && check.is(record.event))
  )
  if (assetEvents.length && eventRecords.createdAtHash) {
    return of(eventRecords.createdAtHash)
  }

  return EMPTY
}

describe('derive assets', () => {
  it('updates on create asset event', async () => {
    const api = new ApiRx({ provider: new WsProvider('ws://127.0.0.1:9988') })
    await firstValueFrom(api.isReady)
    const checks = [api.events.assets.Created, api.events.assets.Destroyed]
    const { hash: currentBlockHash } = await firstValueFrom(api.rpc.chain.subscribeNewHeads())
    const resultObservable = concat(of(currentBlockHash as Hash), api.query.system.events()
      .pipe(switchMap((events: Vec<EventRecord>) => extractEvents(events, checks))))
      .pipe(tap((blockHash) => console.log(`Block hash: ${blockHash}`)))
      .pipe(
        switchMap((blockHash: Hash) =>
          combineLatest([
            api.query.assets.asset.entriesAt(blockHash),
            api.query.assets.metadata.entriesAt(blockHash),
            api.query.assets.asset.keysAt(blockHash)
          ])
        )
      )
      // .pipe(tap(keys => console.log(`Keys: ${keys.map(k => k.toHuman())}`)))
      // .pipe(
      //   switchMap((blockHash: Hash) => api.query.assets.asset.keysAt(blockHash))
      // )
      // // .pipe(tap(keys => console.log(`Keys: ${keys.map(k => k.toHuman())}`)))
      // .pipe(
      //   switchMap((keys) => {
      //     const ids = keys.map(({ args: [id] }) => id)
      //
      //     return combineLatest([
      //       api.query.assets.asset.entries(ids),
      //       api.query.assets.metadata.multi(ids),
      //       of(ids)
      //     ])
      //   })
      // )
      .pipe(tap(([maybeAssets, maybeMetadatas]) => {
        console.log(`assets = ${maybeAssets.length}\nmetas = ${maybeMetadatas.length}`)
      }))
      .pipe(map(([maybeAssets, maybeMetadatas, ids]) => {
        const result: Asset[] = []

        maybeAssets.forEach((asset, index) => {
          console.log(`For id ${ids[index]} there is ${asset.isSome ? 'an' : 'no'} asset and ${maybeMetadatas[index].decimals.gtn(0) ? 'a' : 'no'} metadata`)
          if (asset.isSome) {
            result.push({
              ...asset.unwrap(),
              ...maybeMetadatas[index],
              id: ids[index]
            } as unknown as Asset)
          }
        })

        return result
      }))

    resultObservable.subscribe(res => console.log(JSON.stringify(res, null, 2)))

    const lastAssetId = await firstValueFrom(api.query.assets.asset.keys().pipe(map(k => k.length)))
    const assetId = lastAssetId + 1
    const extrinsic = api.tx.utility.batchAll([
      api.tx.assets.create(assetId, ALICE, 30000000),
      api.tx.assets.setMetadata(assetId, `test${assetId}`, `TEST${assetId}`, 5)
    ])
    console.log('Sending extrinsic')
    await execute(api, extrinsic, aliceSigner())
    console.log('Executed')
    await waitFor(() => false, { timeout: TIMEOUT })
  }, TIMEOUT)
})
//
// function convertAssetMetadata(fetchedMeta: PalletAssetsAssetMetadata): AssetMeta {
//   return {
//     deposit: fetchedMeta.deposit.toBn(),
//     isFrozen: fetchedMeta.isFrozen.toHuman(),
//     name: fetchedMeta.name.toUtf8(),
//     decimals: fetchedMeta.decimals.toNumber(),
//     symbol: fetchedMeta.symbol.toUtf8()
//   }
// }
//
// function attachMetadataToAssets(ownersAssets: AssetInfoWithId[] | undefined, metadata: PalletAssetsAssetMetadata[] | undefined): UseAssets | undefined {
//   if (ownersAssets?.length !== metadata?.length) {
//     return undefined
//   }
//
//   return metadata && ownersAssets?.map((asset, index) => ({ ...asset, ...(convertAssetMetadata(metadata[index])) }))
// }
