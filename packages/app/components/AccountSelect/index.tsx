import type { Account } from 'use-substrate'
import type { InputInfoProps } from '../FormElements'

import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { isAddressValid } from 'use-substrate'

import { useToggle } from '../../utils'
import { CloseButton } from '../button/CloseButton'
import { InputInfo } from '../FormElements'
import { Arrow } from '../icons'
import { Text } from '../typography'
import { AccountInput } from './AccountInput'
import { AccountTile } from './AccountTile'

export interface Props extends InputInfoProps {
  accounts: Account[],
  currentAccount: Account | undefined,
  setCurrentAccount: (arg: Account) => void,
  withFreeBalance?: boolean,
  label?: string,
  onClose?: () => void,
  withAccountInput?: boolean,
}

export function AccountSelect({ accounts, currentAccount, setCurrentAccount, label, withFreeBalance = false, onClose, withAccountInput, ...inputInfoProps }: Props): JSX.Element {
  const [isOpen, toggleOpen, setOpen] = useToggle()
  const [inputAddress, setInputAddress] = useState<string>('')
  const [inputError, setInputError] = useState<string>()
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputError(undefined)
    if (inputAddress.length) {
      if (isAddressValid(inputAddress)) {
        setCurrentAccount({ address: inputAddress, name: undefined })
      } else {
        setInputError('Invalid account address')
      }
    }
  }, [inputAddress, setCurrentAccount])

  const _toggleOpen = (): void => {
    if (isOpen && !isAddressValid(inputAddress)) {
      setInputAddress('')
    }
    toggleOpen()
  }

  const _onInteractOutside = (e: Event): void => {
    if (anchorRef.current && anchorRef.current.contains(e.target as Node)) {
      e.preventDefault()
    } else if (!isAddressValid(inputAddress)) {
      setInputAddress('')
    }
  }

  const _onItemClick = (account: Account): void => {
    setInputAddress('')
    setCurrentAccount(account)
    setOpen(false)
  }

  return (
    <Popover.Root onOpenChange={setOpen} open={isOpen}>
      <AccountSelectWrapper>
        <Label>
          {label && <StyledText size='SM'>{label}</StyledText>}
          {onClose && <StyledCloseButton data-testid='close-account-select' onClick={onClose}/>}
        </Label>
        <StyledAnchor ref={anchorRef}>
          {isOpen && withAccountInput
            ? (
              <AccountInput
                onChange={setInputAddress}
                value={inputAddress}
                isOpen={isOpen}
                toggleOpen={_toggleOpen}
                error={inputError}
              />
            )
            : (
              <StyledButton data-testid='open-account-select' onClick={_toggleOpen}>
                {currentAccount && !isOpen
                  ? <AccountTile withFreeBalance={withFreeBalance} account={currentAccount}/>
                  : <StyledButtonText color='white' size='SM'>{`Select account${withAccountInput ? ' or paste account address' : ''}`}</StyledButtonText>
                }
                <StyledArrow direction='down' width='14' height='9' />
              </StyledButton>
            )
          }
        </StyledAnchor>
        <InputInfo {...inputInfoProps}/>
      </AccountSelectWrapper>

      <StyledDropdown onInteractOutside={_onInteractOutside}>
        <ul>
          {accounts.map(account => (
            <StyledDropdownItem
              onClick={() => _onItemClick(account)}
              key={account.address}
            >
              <AccountTile withFreeBalance={withFreeBalance} account={account}/>
            </StyledDropdownItem>
          ))}
        </ul>
      </StyledDropdown>
    </Popover.Root>
  )
}

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`

const StyledButton = styled(Popover.Trigger)`
  position: relative;
  max-width: 636px;
  padding: 0;
  margin: 0;
  width: 100%;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[800]};
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  
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

const StyledDropdown = styled(Popover.Content)`
  overflow-y: auto;
  transform: translateY(4px);
  width: 636px;
  max-height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[800]};
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  &::-webkit-scrollbar {
    width: 0;
  }
`

const StyledDropdownItem = styled.li`
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

const StyledButtonText = styled(Text)`
  padding: 28px 18px 28px;
  text-align: left;
`

const StyledAnchor = styled(Popover.Anchor)`
  max-width: 636px;
`
