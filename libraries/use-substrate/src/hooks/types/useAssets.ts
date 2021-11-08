import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup'

import { StorageKey, u32 } from '@polkadot/types'

export type FetchedAssets = [StorageKey<[u32]>, PalletAssetsAssetDetails][];

export interface AssetInfo {
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

export interface Asset extends AssetInfo {
  readonly id: string;
}

export type UseAssets = Asset[]

export interface UseAssetsOptions {
  owner?: string
}
