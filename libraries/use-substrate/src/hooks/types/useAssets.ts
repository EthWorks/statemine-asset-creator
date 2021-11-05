import type { StorageKey } from '@polkadot/types'
import type { AssetId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup'

export type FetchedAssets = [StorageKey<[AssetId]>, PalletAssetsAssetDetails][];

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

export interface AssetMeta {
  readonly deposit: string;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: string;
  readonly isFrozen: boolean;
}

export interface AssetInfoWithId extends AssetInfo {
  readonly id: AssetId;
}

export type Asset = AssetInfoWithId & AssetMeta

export type UseAssets = Asset[]

export interface UseAssetsOptions {
  owner?: string
}
