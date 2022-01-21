import type { StorageKey } from '@polkadot/types'
import type { AccountId, AssetId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { Chains } from '../consts'
import type { AssetInfoWithId, AssetMeta, FetchedAssets, UseAssets, UseAssetsOptions } from './types/useAssets'

import _ from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useApi } from './useApi'
import { useChainEvents } from './useChainEvents'
import { useObservable, useObservable2 } from './useObservable'

export function useAssets(chain: Chains, options?: UseAssetsOptions): UseAssets | undefined {
  const [ids, setIds] = useState<AssetId[]>()
  const [ownerAssets, setOwnerAssets] = useState<AssetInfoWithId[]>([])
  const { api, connectionState } = useApi(chain)
  const CHECKS = useMemo(() => [api?.events.assets.Created, api?.events.assets.Destroyed], [api])

  const { blockHash } = useChainEvents(chain, CHECKS) || {}
  const fetchedAssets = useObservable<FetchedAssets>((blockHash ? api?.query.assets.asset.entriesAt(blockHash) : api?.query.assets.asset.entries()), [api, connectionState, blockHash])
  const metadata = useObservable2(api?.query.assets.metadata.multi(ids ?? []), [JSON.stringify(ids), api, connectionState])
  ids?.forEach(id => console.log('id', id.toString()))
  const metadataRef = useRef<PalletAssetsAssetMetadata[]>()
  if (!_.isEqual(metadata, metadataRef.current)) {
    console.log('not equal')
    metadataRef.current = metadata
  }
  metadata?.forEach(asset => console.log('froom hok', asset.name.toHuman()))

  useEffect(() => {
    if (!fetchedAssets) return undefined

    const assets = convertAssets(fetchedAssets)

    setOwnerAssets(filterByOwner(assets, options?.owner))
  }, [JSON.stringify(fetchedAssets), options?.owner])

  useEffect(() => {
    setIds(getAssetsIds(ownerAssets))
  }, [JSON.stringify(ownerAssets)])

  return useMemo(() => {
    const assets = attachMetadataToAssets(ownerAssets, metadata)

    metadata?.forEach(asset => console.log('froom memo', asset.name.toHuman()))
    // assets?.forEach(asset => console.log(asset.name))

    return assets
  }, [JSON.stringify(ownerAssets), JSON.stringify(metadata)])
}

function convertAssets(assets: FetchedAssets): AssetInfoWithId[] {
  return assets.map(asset => {
    const {
      owner, issuer, freezer, admin, isSufficient, isFrozen, supply, deposit,
      minBalance, accounts, sufficients, approvals
    } = asset[1].unwrap()

    return {
      id: extractAssetId(asset[0]),
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
      approvals: approvals.toBn()
    }
  })
}

function extractAssetId(key: StorageKey<[AssetId]>): AssetId {
  return key.args[0]
}

function filterByOwner(assets: AssetInfoWithId[], owner?: AccountId | string): AssetInfoWithId[] {
  return owner ? assets.filter(asset => asset.owner.eq(owner)) : assets
}

function getAssetsIds(ownersAssets: AssetInfoWithId[] | undefined): AssetId[] | undefined {
  return ownersAssets?.map(asset => asset.id)
}

function convertAssetMetadata(fetchedMeta: PalletAssetsAssetMetadata): AssetMeta {
  return {
    deposit: fetchedMeta.deposit.toBn(),
    isFrozen: fetchedMeta.isFrozen.toHuman(),
    name: fetchedMeta.name.toUtf8(),
    decimals: fetchedMeta.decimals.toNumber(),
    symbol: fetchedMeta.symbol.toUtf8()
  }
}

function attachMetadataToAssets(ownersAssets: AssetInfoWithId[] | undefined, metadata: PalletAssetsAssetMetadata[] | undefined): UseAssets | undefined {
  if (ownersAssets?.length !== metadata?.length) {
    return undefined
  }

  return metadata && ownersAssets?.map((asset, index) => ({ ...asset, ...(convertAssetMetadata(metadata[index])) }))
}
