import { Account, Chains, useBalances } from 'use-substrate'

interface Props {
  account: Account
}

export function AccountTile({ account }: Props): JSX.Element {
  const balance = useBalances(Chains.Kusama, account.address)

  return (
    <div>
      <div>Account Name: {account.name}</div>
      <div>Account Address: {account.address}</div>
      <div>Full Account Balance: {balance?.freeBalance.toString()}</div>
      <div>Transferable Balance: {balance?.availableBalance.toString()}</div>
    </div>
  )
}
