import type { AccountId, EventRecord, Hash } from '@polkadot/types/interfaces'
import type { Chains } from '../consts'
import type { Asset, UseAssets, UseAssetsOptions } from './types/useAssets'

import { ApiRx } from '@polkadot/api'
import { AugmentedEvent } from '@polkadot/api/types'
import { Vec } from '@polkadot/types'
import { useMemo } from 'react'
import { combineLatest, concat, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs'

import { FetchedAsset } from './types/useAssets'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

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

export function all(api: ApiRx): Observable<FetchedAsset[]> {
  const checks = [api.events.assets.Created, api.events.assets.Destroyed]

  const initBlockHash = api.rpc.chain.subscribeNewHeads()
    .pipe(take(1))
    .pipe(val => val.pipe(map(({ hash }) => hash)))

  const resultObservable = concat(
    initBlockHash,
    api.query.system.events()
      .pipe(switchMap((events: Vec<EventRecord>) => extractEvents(events, checks)))
  )
    .pipe(tap((blockHash) => console.log(`Block hash: ${blockHash.toString()}`)))
    .pipe(
      switchMap((blockHash: Hash) =>
        combineLatest([
          api.query.assets.asset.entriesAt(blockHash),
          api.query.assets.metadata.entriesAt(blockHash),
          api.query.assets.asset.keysAt(blockHash)
        ])
      )
    )
    .pipe(map(([maybeAssets, maybeMetadatas, ids]) => {
      const result: FetchedAsset[] = []

      maybeAssets.forEach(([, asset], index) => {
        if (asset.isSome) {
          result.push({
            ...asset.unwrap(),
            ...maybeMetadatas[index][1],
            id: ids[index]
          } as FetchedAsset)
        }
      })

      return result
    }))

  return resultObservable
}

export function useAssets(chain: Chains, options?: UseAssetsOptions): UseAssets | undefined {
  const { api, connectionState } = useApi(chain)

  const fetchedAssets = useObservable<FetchedAsset[]>(api ? all(api) : undefined, [api, connectionState])

  return useMemo(() => {
    if (!fetchedAssets) return []
    const converted = convertAssets(fetchedAssets)
    console.log('from memo', converted)

    return options?.owner ? filterByOwner(converted, options.owner) : converted
  }, [options?.owner, fetchedAssets])
}

function convertAssets(fetchedAssets: FetchedAsset[]): Asset[] {
  return fetchedAssets.map(fetchedAsset => {
    const {
      owner, issuer, freezer, admin, isSufficient, isFrozen, supply, deposit,
      minBalance, accounts, sufficients, approvals, decimals, id, symbol, name
    } = fetchedAsset

    return {
      id: id.args[0],
      owner,
      issuer,
      freezer,
      admin,
      isSufficient: isSufficient.toHuman(),
      isFrozen: isFrozen.toHuman(),
      supply: supply.toBn(),
      deposit: deposit.toBn(),
      minBalance: minBalance.toBn(),
      accounts: accounts.toBn(),
      sufficients: sufficients.toBn(),
      approvals: approvals.toBn(),
      name: name.toUtf8(),
      decimals: decimals.toNumber(),
      symbol: symbol.toUtf8()
    }
  })
}

function filterByOwner(assets: Asset[], owner: AccountId | string): Asset[] {
  return assets.filter(asset => asset.owner.eq(owner))
}
