import { FC } from 'react'

import { Role } from './types'

interface Props {
  account: string,
  role: Role[]
}

export const Account: FC<Props> = ({ account, role }) => {
  return (
    <div data-testid={`role-${role}`}>
      <label>{role}</label>
      <div>{account}</div>
    </div>
  )
}
