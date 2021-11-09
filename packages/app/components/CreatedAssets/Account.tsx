import type { FC } from 'react'
import type { Role } from './types'

interface Props {
  account: string,
  role: Role[]
}

export const Account: FC<Props> = ({ account, role }) => {
  return (
    <div data-testid={`role-${role.join('-')}`}>
      <label>{role.join(', ')}</label>
      <div>{account}</div>
    </div>
  )
}