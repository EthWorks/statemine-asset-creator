import type { StorageKey } from '@polkadot/types'
import type { AccountId, AssetId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup'

import BN from 'bn.js'

export type FetchedAssets = [StorageKey<[AssetId]>, PalletAssetsAssetDetails][];

export interface AssetInfo {
  readonly owner: AccountId;
  readonly issuer: AccountId;
  readonly admin: AccountId;
  readonly freezer: AccountId;
  readonly supply: BN;
  readonly deposit: BN;
  readonly minBalance: BN;
  readonly isSufficient: boolean;
  readonly accounts: BN;
  readonly sufficients: BN;
  readonly approvals: BN;
  readonly isFrozen: boolean;
}

export interface AssetMeta {
  readonly deposit: BN;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly isFrozen: boolean;
}

export interface AssetInfoWithId extends AssetInfo {
  readonly id: AssetId;
}

export type Asset = AssetInfoWithId & AssetMeta

export type UseAssets = Asset[]

export interface UseAssetsOptions {
  owner?: AccountId
}
