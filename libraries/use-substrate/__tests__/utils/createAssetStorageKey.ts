import { ApiRx } from '@polkadot/api'
import { StorageKey } from '@polkadot/types'
import { AssetId } from '@polkadot/types/interfaces'

import { createApiWithAugmentations } from './createApiWithAugmentations'

let api: ApiRx
export function createAssetStorageKey(id: number): StorageKey<[AssetId]> {
  if (!api) {
    api = createApiWithAugmentations()
  }

  const assetId = api.createType('AssetId', id)
  const key = new StorageKey<[AssetId]>(api.registry, api.query.assets.asset.key(assetId))
  key.setMeta(api.query.assets.asset.creator.meta)

  return key
}
