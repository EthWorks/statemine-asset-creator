import type { StorageKey } from '@polkadot/types'
import type { AccountId, AssetId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { Chains } from '../consts'
import type { AssetInfoWithId, AssetMeta, FetchedAssets, UseAssets, UseAssetsOptions } from './types/useAssets'

import { useEffect, useMemo, useState } from 'react'

import { useApi } from './useApi'
import { useObservable } from './useObservable'

export function useAssets(chain: Chains, options?: UseAssetsOptions): UseAssets | undefined {
  const [ids, setIds] = useState<AssetId[]>()
  const [ownerAssets, setOwnerAssets] = useState<AssetInfoWithId[]>([])
  const { api, connectionState } = useApi(chain)

  const fetchedAssets = useObservable<FetchedAssets>(api?.query.assets.asset.entries(), [api, connectionState])
  const metadata = useObservable<PalletAssetsAssetMetadata[]>(ids ? api?.query.assets.metadata.multi(ids) : undefined, [ids, api, connectionState])

  useEffect(() => {
    if (!fetchedAssets) return undefined

    const assets = convertAssets(fetchedAssets)

    setOwnerAssets(filterByOwner(assets, options?.owner))
  }, [fetchedAssets, options?.owner])

  useEffect(() => {
    setIds(getAssetsIds(ownerAssets))
  }, [ownerAssets])

  return useMemo(() => attachMetadataToAssets(ownerAssets, metadata), [ownerAssets, metadata])
}

function convertAssets(assets: FetchedAssets): AssetInfoWithId[] {
  return assets.map( asset => {
    const { owner, issuer, freezer, admin, isSufficient, isFrozen, supply, deposit,
      minBalance, accounts, sufficients, approvals } = asset[1].unwrap()

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
      approvals: approvals.toBn(),
    }
  })
}

function extractAssetId (key: StorageKey<[AssetId]>): AssetId {
  return key.args[0]
}

function filterByOwner(assets: AssetInfoWithId[], owner?: AccountId | string): AssetInfoWithId[] {
  return owner ? assets.filter(asset => asset.owner.eq(owner)) : assets
}

function getAssetsIds(ownersAssets: AssetInfoWithId[] | undefined): AssetId[] | undefined {
  return ownersAssets?.map(asset => asset.id)
}

function convertAssetMetadata (fetchedMeta: PalletAssetsAssetMetadata): AssetMeta {
  return {
    deposit: fetchedMeta.deposit.toBn(),
    isFrozen: fetchedMeta.isFrozen.toHuman(),
    name: fetchedMeta.name.toHuman() as string,
    decimals: fetchedMeta.decimals.toNumber(),
    symbol: fetchedMeta.symbol.toHuman() as string
  }
}

function attachMetadataToAssets(ownersAssets: AssetInfoWithId[] | undefined, metadata: PalletAssetsAssetMetadata[] | undefined): UseAssets | undefined {
  if (ownersAssets?.length !== metadata?.length) {
    return undefined
  }

  return metadata && ownersAssets?.map((asset, index) => ({ ...asset, ...(convertAssetMetadata(metadata[index])) }))
}
