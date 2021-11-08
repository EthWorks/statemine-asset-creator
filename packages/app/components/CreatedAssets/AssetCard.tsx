import { FC } from 'react'

import { Asset } from 'use-substrate'

import { Account } from './Account'
import { groupRoles } from './groupRoles'

interface Props {
  asset: Asset
}

export const AssetCard: FC<Props> = ({ asset }) => {
  const { name, id, decimals, supply, admin, issuer, freezer } = asset
  const rolesByAccount = groupRoles({ admin, issuer, freezer })

  return (
    <div data-testid={`asset-card-${id.toNumber()}`}>
      <div>{name}</div>
      <div>id: {id.toNumber()}</div>
      <div>total supply: {supply} KSM</div>
      <div>decimals: {decimals}</div>
      {rolesByAccount.map(account => <Account key={account[1]} account={account[1]} role={account[0]}/>)}
    </div>
  )
}
