import type { Asset, AssetInfo, FetchedAssets, UseAssets, UseAssetsOptions } from './types/useAssets'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

export function useAssets(chain: Chains, options?: UseAssetsOptions): UseAssets | undefined {
  const { api, connectionState } = useApi(chain)

  const fetchedAssets = useObservable<FetchedAssets>(api?.query.assets.asset.entries(), [api, connectionState])

  if (!fetchedAssets) return undefined

  const assets = formatAssets(fetchedAssets)

  return filterByOwner(assets, options?.owner)
}

function formatAssets(assets: FetchedAssets): UseAssets {
  return assets?.map(asset => ({ ...(asset[1].toHuman() as unknown as AssetInfo), id: asset[0].toString() }))
}

function filterByOwner(assets: Asset[], owner?: string): UseAssets {
  return owner? assets.filter(asset => asset.owner === owner) : assets
}
