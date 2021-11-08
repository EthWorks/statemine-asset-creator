import { FC } from 'react'

import { Asset } from 'use-substrate'

import { groupRoles } from './groupRoles'

interface Props {
  asset: Asset
}

export const AssetCard: FC<Props> = ({ asset }) => {
  const { name, id, decimals, supply, admin, issuer, freezer, owner } = asset
  const sortedAdmins = groupRoles({ admin, issuer, freezer })

  return (
    <div data-testid={`asset-card-${id.toNumber()}`}>
      <div>{name}</div>
      <div>id: {id.toNumber()}</div>
      <div>total supply: {supply} KSM</div>
      <div>decimals: {decimals}</div>
      {/*{sortedAdmins.map(admin => <Account key={admin[1]} account={admin[0]} role={admin[1]}/>)}*/}
    </div>
  )
}
