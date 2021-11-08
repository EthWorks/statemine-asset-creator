import { FC } from 'react'

import { Asset } from 'use-substrate'

import { Account } from './Account'

interface Props {
  asset: Asset
}

export const AssetCard: FC<Props> = ({ asset }) => {
  const { name, id, decimals, owner, supply, admin, issuer, freezer } = asset

  return (
    <div data-testid={`asset-card-${id.toNumber()}`}>
      <div>{name}</div>
      <div>id: {id.toNumber()}</div>
      <div>total supply: {supply} KSM</div>
      <div>decimals: {decimals}</div>
      <Account/>
    </div>
  )
}
