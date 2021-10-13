import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Account } from 'use-substrate'

interface Props {
  accounts: Account[]
}

export function AccountSelect ({ accounts }: Props): JSX.Element {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Click here</DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {accounts.map(account => (
          <DropdownMenu.Item key={account.address}>Name: {account.name} Address: {account.address}</DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
