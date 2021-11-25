import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import styled from 'styled-components'

import { Account } from 'use-substrate'

import { CloseButton } from '../button/CloseButton'
import { InputInfo, InputInfoProps } from '../FormElements/Inputs/InputInfo'
import { Arrow } from '../icons/Arrow'
import { Text } from '../typography'
import { AccountTile } from './AccountTile'

export interface Props extends InputInfoProps {
  accounts: Account[],
  currentAccount: Account,
  setCurrentAccount: (arg: Account) => void,
  withFreeBalance?: boolean,
  label?: string,
  onClose?: () => void
}

export function AccountSelect ({ accounts, currentAccount, setCurrentAccount, label, withFreeBalance = false, onClose, ...inputInfoProps }: Props): JSX.Element {
  return (
    <DropdownMenu.Root>
      <AccountSelectWrapper>
        <Label>
          {label && <StyledText size='SM'>{label}</StyledText>}
          {onClose && <StyledCloseButton data-testid='close-account-select' onClick={onClose}/>}
        </Label>
        <StyledButton data-testid='open-account-select'>
          <AccountTile withFreeBalance={withFreeBalance} account={currentAccount} />
          <StyledArrow direction='down' width='14' height='9' />
        </StyledButton>
        <InputInfo {...inputInfoProps}/>
      </AccountSelectWrapper>

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
  max-width: 636px;
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
  overflow-y: auto;
  transform: translateY(4px);
  width: 636px;
  max-height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[800]};
  
  &::-webkit-scrollbar {
    width: 0;
  }
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

const Label = styled.div`
  display: flex;
  align-items: center;
`

const StyledCloseButton = styled(CloseButton)`
  margin-left: auto;
`

const AccountSelectWrapper = styled.div`
  position: relative;
  padding-bottom: 20px;
`
