import { FC } from 'react'

interface Props {
  account: string,
  role: string
}

export const Account: FC<Props> = ({ account, role }) => {
  return (
    <div data-testid={`role-${role}`}>
      <label>{role}</label>
      <div>{account}</div>
    </div>
  )
}
