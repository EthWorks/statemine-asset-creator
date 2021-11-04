import type { StorageKey, u32 } from '@polkadot/types'
import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup'
import type { AnyJson } from '@polkadot/types/types'

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

export interface AssetMeta {
  readonly deposit: string;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: string;
  readonly isFrozen: boolean;
}

export interface AssetInfoWithId extends AssetInfo {
  readonly id: AnyJson;
}

export type Asset = AssetInfoWithId & AssetMeta

export type UseAssets = Asset[]

export interface UseAssetsOptions {
  withDetails?: boolean,
  owner?: string
}
