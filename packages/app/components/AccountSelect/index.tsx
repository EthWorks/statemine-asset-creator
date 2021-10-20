import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Account } from 'use-substrate'
import { AccountTile } from './AccountTile'

interface Props {
  accounts: Account[],
  currentAccount: Account,
  setCurrentAccount: (arg: Account) => void
}

export function AccountSelect ({ accounts, currentAccount, setCurrentAccount }: Props): JSX.Element {

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <AccountTile account={currentAccount}/>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {accounts.map(account => (
          <DropdownMenu.Item
            onClick={() => setCurrentAccount(account)}
            key={account.address}
          >
            <AccountTile account={account}/>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
