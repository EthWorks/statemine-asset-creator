import type { Account } from 'use-substrate'
import type { InputInfoProps } from '../FormElements'

import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Chains, isAddressValid } from 'use-substrate'

import { useToggle } from '../../utils'
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
  withAccountInput?: boolean,
  disabled?: boolean,
  button?: React.ReactNode,
  chain: Chains
}

export function AccountSelect({ accounts, currentAccount, setCurrentAccount, label, withFreeBalance = false, withAccountInput, disabled, button, chain, ...inputInfoProps }: Props): JSX.Element {
  const [isOpen, toggleOpen, setOpen] = useToggle()
  const [inputAddressValue, setInputAddressValue] = useState<string>('')
  const [inputAddressError, setInputAddressError] = useState<string>()
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputAddressError(undefined)
    if (inputAddressValue.length) {
      if (isAddressValid(inputAddressValue)) {
        setCurrentAccount({ address: inputAddressValue, name: undefined })
      } else {
        setInputAddressError('Invalid account address')
      }
    }
  }, [inputAddressValue, setCurrentAccount])

  const _toggleOpen = (): void => {
    if (isOpen && !isAddressValid(inputAddressValue)) {
      setInputAddressValue('')
    }
    toggleOpen()
  }

  const _onInteractOutside = (e: Event): void => {
    if (anchorRef.current && anchorRef.current.contains(e.target as Node)) {
      e.preventDefault()
    } else if (!isAddressValid(inputAddressValue)) {
      setInputAddressValue('')
    }
  }

  const _onItemClick = (account: Account): void => {
    setInputAddressValue('')
    setCurrentAccount(account)
    setOpen(false)
  }

  return (
    <Popover.Root onOpenChange={setOpen} open={isOpen}>
      <AccountSelectWrapper>
        <Label>
          {label && <StyledText size='SM'>{label}</StyledText>}
          {button}
        </Label>
        <StyledAnchor ref={anchorRef}>
          {isOpen && withAccountInput
            ? (
              <AccountInput
                onChange={setInputAddressValue}
                value={inputAddressValue}
                isOpen={isOpen}
                toggleOpen={_toggleOpen}
                error={inputAddressError}
              />
            )
            : (
              <StyledButton
                disabled={disabled}
                data-testid='open-account-select'
                onClick={_toggleOpen}
              >
                {currentAccount && !isOpen
                  ? <AccountTile
                    withFreeBalance={withFreeBalance}
                    account={currentAccount}
                    chain={chain}
                  />
                  : <StyledButtonText color='white' size='SM'>{`Select account${withAccountInput ? ' or paste account address' : ''}`}</StyledButtonText>
                }
                {!disabled && <StyledArrow direction={isOpen ? 'up' : 'down'} width='14' height='9' />}
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
              <AccountTile
                withFreeBalance={withFreeBalance}
                account={account}
                chain={chain}
              />
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
  
  &:active,
  &:focus-visible,
  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[50]};
    outline: 2px solid ${({ theme }) => theme.colors.gray[50]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[900]};
    cursor: not-allowed;

    &:active,
    &:focus-visible,
    &:hover {
      border-color: transparent;
      outline: none;
    }
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
