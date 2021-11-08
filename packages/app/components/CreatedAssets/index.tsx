import { FC } from 'react'

import { UseAssets } from 'use-substrate'

import { AssetCard } from './AssetCard'

interface Props {
  assets: UseAssets | undefined
}

export const CreatedAssets: FC<Props> = ({ assets }) => {
  if(!assets) {
    return null
  }

  return (
    <div>
      <div>Dashboard</div>
      <div>Created assets [{assets.length}]</div>
      <div data-testid='created-assets'>
        {assets.map(asset => <AssetCard key={asset.id.toString()} asset={asset}/>)}
      </div>
    </div>
  )
}
