import type { FC } from 'react'
import type { Asset } from 'use-substrate'

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
      <div>total supply: {supply.toString()} KSM</div>
      <div>decimals: {decimals}</div>
      {rolesByAccount.map(account => <Account key={account[0].toString()} account={account[0].toString()} role={account[1]}/>)}
    </div>
  )
}
