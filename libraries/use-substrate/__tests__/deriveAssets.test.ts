import { ApiRx, Keyring, WsProvider } from '@polkadot/api'
import { AugmentedEvent, SubmittableExtrinsic } from '@polkadot/api/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { Vec } from '@polkadot/types'
import { EventRecord, ExtrinsicStatus, Hash } from '@polkadot/types/interfaces'
import { Codec } from '@polkadot/types/types'
import { combineLatest, concat, EMPTY, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs'

import { Asset } from '../src'
import { waitFor } from './utils/waitFor'
import { ALICE } from './consts'

export function aliceSigner(): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' })

  return keyring.addFromUri('//Alice')
}
export async function execute(extrinsic: SubmittableExtrinsic<'rxjs'>, singer: KeyringPair, logger = { info: console.log }): Promise<void> {
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
          } else if (event.method === 'ExtrinsicFailed') {
            logger.info('Transaction failed')
          }
        }
      )
      currentTxDone = true
    }
  }

  await firstValueFrom(extrinsic.signAndSend(singer, sendStatusCb))
  await waitFor(() => currentTxDone, { timeout: 20000 })
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

  return of()
}

describe('derive assets', () => {
  it('updates on create asset event', async () => {
    const apiRx = new ApiRx({ provider: new WsProvider('ws://127.0.0.1:9988') })
    await firstValueFrom(apiRx.isReady)
    const checks = [apiRx.events.assets.Created, apiRx.events.assets.Destroyed]
    const currentBlockNumber = await firstValueFrom(apiRx.query.system.number())
    const currentBlockHash = await firstValueFrom(apiRx.query.system.blockHash(currentBlockNumber.subn(1)))

    const project = (events: Vec<EventRecord>) => extractEvents(events, checks)
    const resultObservable = concat(of(currentBlockHash), apiRx.query.system.events().pipe(switchMap(project)))
      .pipe(tap((b) => console.log(b)))
      .pipe(
        switchMap((blockHash: Hash) => apiRx.query.assets.asset.keysAt(blockHash))
      )
      .pipe(
        switchMap((keys) => {
          const ids = keys.map(({ args: [id] }) => id)

          return combineLatest([
            apiRx.query.assets.asset.multi(ids),
            apiRx.query.assets.metadata.multi(ids)
          ])
        })
      )
      .pipe(map(([maybeAssets, maybeMetadatas]) => {
        const result: Asset[] = []

        maybeAssets.forEach((asset, index) => {
          if (asset.isSome) {
            result.push({
              ...asset.unwrap(),
              ...maybeMetadatas[index]
            } as unknown as Asset)
          }
        })

        return result
      }))

    resultObservable.subscribe(res => console.log(JSON.stringify(res, null, 2)))

    const extrinsic = apiRx.tx.assets.create(14, ALICE, 300)
    console.log('Sending extrinsic')
    await execute(extrinsic, aliceSigner())
    console.log('Executed')
  }, 100000)
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
