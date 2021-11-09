import { FC } from 'react'

import { Chains, useApi, useAssets } from 'use-substrate'

import { AssetCard } from './AssetCard'

export const CreatedAssets: FC = () => {
  const { api } = useApi(Chains.Statemine)
  const account = localStorage.getItem('activeAccount')
  const assets = useAssets(Chains.Statemine, { owner: api?.registry.createType('AccountId', account) })

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
