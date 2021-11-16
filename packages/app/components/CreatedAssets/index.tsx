import { FC } from 'react'

import { Chains, useAssets } from 'use-substrate'

import { AssetCard } from './AssetCard'

export const CreatedAssets: FC = () => {
  const account = localStorage.getItem('activeAccount') ?? undefined
  const assets = useAssets(Chains.Statemine, { owner: account })

  if(!assets) {
    return null
  }

  return (
    <div>
      <div>Created assets [{assets.length}]</div>
      <div data-testid='created-assets'>
        {assets.map(asset => <AssetCard key={asset.id.toString()} asset={asset}/>)}
      </div>
    </div>
  )
}
