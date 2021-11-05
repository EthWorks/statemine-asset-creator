import type { StorageKey } from '@polkadot/types'
import type { AssetId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { Chains } from '../consts'
import type { AssetInfo, AssetInfoWithId, AssetMeta, FetchedAssets, UseAssets, UseAssetsOptions } from './types/useAssets'

import { useEffect, useMemo, useState } from 'react'

import { useApi } from './useApi'
import { useObservable } from './useObservable'

export function useAssets(chain: Chains, options?: UseAssetsOptions): UseAssets | undefined {
  const [ids, setIds] = useState<AssetId[] | undefined>(undefined)
  const [ownerAssets, setOwnerAssets] = useState<AssetInfoWithId[]>([])
  const { api, connectionState } = useApi(chain)

  const fetchedAssets = useObservable<FetchedAssets>(api?.query.assets.asset.entries(), [api, connectionState])
  const metadata = useObservable<PalletAssetsAssetMetadata[]>(ids ? api?.query.assets.metadata.multi(ids) : undefined, [ids, api, connectionState])

  useEffect(() => {
    if (!fetchedAssets) return undefined

    const assets = formatAssets(fetchedAssets)

    setOwnerAssets(filterByOwner(assets, options?.owner))
  }, [fetchedAssets, options?.owner])

  useEffect(() => {
    setIds(getAssetsIds(ownerAssets))
  }, [ownerAssets])

  return useMemo(() => attachMetadataToAssets(ownerAssets, metadata), [ownerAssets, metadata])
}

function formatAssets(assets: FetchedAssets): AssetInfoWithId[] {
  return assets.map(asset => ({ ...(asset[1].toHuman() as unknown as AssetInfo), id: extractAssetIds(asset[0]) }))
}

function extractAssetIds (key: StorageKey<[AssetId]>): AssetId {
  return key.args[0]
}

function filterByOwner(assets: AssetInfoWithId[], owner?: string): AssetInfoWithId[] {
  return owner ? assets.filter(asset => asset.owner === owner) : assets
}

function getAssetsIds(ownersAssets: AssetInfoWithId[] | undefined): AssetId[] | undefined {
  return ownersAssets?.map(asset => asset.id)
}

function attachMetadataToAssets(ownersAssets: AssetInfoWithId[] | undefined, metadata: PalletAssetsAssetMetadata[] | undefined): UseAssets | undefined {
  if (ownersAssets?.length !== metadata?.length) {
    return undefined
  }

  return metadata && ownersAssets?.map((asset, index) => ({ ...asset, ...(metadata[index].toHuman() as unknown as AssetMeta) }))
}
