import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import styled from 'styled-components'

import { Account } from 'use-substrate'

import { Arrow } from '../icons/Arrow'
import { Text } from '../typography'
import { AccountTile } from './AccountTile'

export interface Props {
  accounts: Account[],
  currentAccount: Account,
  setCurrentAccount: (arg: Account) => void,
  withFreeBalance?: boolean;
  label?: string
}

export function AccountSelect ({ accounts, currentAccount, setCurrentAccount, label, withFreeBalance = false }: Props): JSX.Element {
  return (
    <DropdownMenu.Root>
      <div>
        {label && <StyledText size='SM'>{label}</StyledText>}
        <StyledButton data-testid='open-account-select'>
          <AccountTile withFreeBalance={withFreeBalance} account={currentAccount} />
          <StyledArrow direction='down' width='14' height='9' />
        </StyledButton>
      </div>

      <StyledDropdown>
        {accounts.map(account => (
          <StyledDropdownItem
            onClick={() => setCurrentAccount(account)}
            key={account.address}
          >
            <AccountTile withFreeBalance={withFreeBalance} account={account}/>
          </StyledDropdownItem>
        ))}
      </StyledDropdown>
    </DropdownMenu.Root>
  )
}

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`

const StyledButton = styled(DropdownMenu.Trigger)`
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[800]};
  color: ${({ theme }) => theme.colors.gray[400]};

  &[data-state=open] {
    ${StyledArrow} {
      transform: translateY(-50%) rotate(180deg);
    }
  }
  
  &:active,
  &:focus-visible,
  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[50]};
    outline: 2px solid ${({ theme }) => theme.colors.gray[50]};
  }
`

const StyledDropdown = styled(DropdownMenu.Content)`
  transform: translateY(4px);
  width: calc(100% + 8px);
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[800]};
`

const StyledDropdownItem = styled(DropdownMenu.Item)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  
  &:last-child {
    border: none;
  }
  
  &:focus-visible {
    outline: none;
  }
`

const StyledText = styled(Text)`
  margin-bottom: 4px;
`
