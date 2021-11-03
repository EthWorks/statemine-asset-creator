import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup'

import { StorageKey, u32 } from '@polkadot/types'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

export type FetchedAssets = [StorageKey<[u32]>, PalletAssetsAssetDetails][];

interface AssetInfo {
  readonly owner: string;
  readonly issuer: string;
  readonly admin: string;
  readonly freezer: string;
  readonly supply: string;
  readonly deposit: string;
  readonly minBalance: string;
  readonly isSufficient: boolean;
  readonly accounts: string;
  readonly sufficients: string;
  readonly approvals: string;
  readonly isFrozen: boolean;
}

type UseAssets = AssetInfo[]

export function useAssets(chain: Chains): UseAssets | undefined{
  const { api, connectionState } = useApi(chain)

  const assets =  useObservable<FetchedAssets>(api?.query.assets.asset.entries(), [api, connectionState])

  return assets?.map(asset => asset[1].toHuman() as unknown as AssetInfo)
}
