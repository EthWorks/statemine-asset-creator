import type { Account } from 'use-substrate'

import { fireEvent, render, screen, within } from '@testing-library/react'
import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { Chains } from 'use-substrate'

import { AccountSelect } from '../components'
import { theme } from '../styles/styleVariables'
import { assertText, selectAccountFromDropdown } from './helpers'
import { charlieAccount, mockAccounts, mockUseAccounts, mockUseBalances, mockUseSubstrate } from './mocks'

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useBalances: () => mockUseBalances
}))

interface TestComponentProps {
  withFreeBalance?: boolean;
  withAccountInput?: boolean;
  disabled?: boolean
}

function AccountSelectTestComponent({ withFreeBalance, withAccountInput, disabled }: TestComponentProps): JSX.Element {
  const accounts = mockUseSubstrate.useAccounts()
  const [account, setAccount] = useState<Account>()

  return (
    <ThemeProvider theme={theme}>
      <AccountSelect
        accounts={accounts.allAccounts}
        currentAccount={account}
        setCurrentAccount={setAccount}
        withFreeBalance={withFreeBalance}
        withAccountInput={withAccountInput}
        disabled={disabled}
        chain={Chains.Kusama}
      />
    </ThemeProvider>
  )
}

describe('AccountSelect component', () => {
  it('displays "Select account" when no current account was set', async () => {
    render(<AccountSelectTestComponent/>)

    await assertText('Select account')
  })

  it('displays accounts in dropdown', async () => {
    render(<AccountSelectTestComponent/>)

    await openDropdown()

    const dropdownMenu = await screen.findByRole('list')

    await within(dropdownMenu).findByText('ALICE')
    await within(dropdownMenu).findByText('BOB')
  })

  it('sets selected account as current account', async () => {
    render(<AccountSelectTestComponent/>)

    await selectAccountFromDropdown(0, 1)

    const openDropdownButton = await screen.findByRole('button')
    await within(openDropdownButton).findByText('BOB')
    expect(await within(openDropdownButton).queryAllByAltText('ALICE')).toHaveLength(0)
  })

  it('shows "Select account" on button when dropdown is open', async () => {
    render(<AccountSelectTestComponent/>)

    const openDropdownButton = await screen.findByRole('button')
    await within(openDropdownButton).findByText('Select account')

    await selectAccountFromDropdown(0, 1)
    await within(openDropdownButton).findByText('BOB')
    expect(within(openDropdownButton).queryAllByText('Select account')).toHaveLength(0)

    fireEvent.click(openDropdownButton)
    await within(openDropdownButton).findByText('Select account')
  })

  it('shows free balance', async () => {
    render(<AccountSelectTestComponent withFreeBalance/>)

    await selectAccountFromDropdown(0, 0)

    await screen.findByText(mockAccounts[0].name)
    await screen.findByText(mockAccounts[0].address)

    const transferableBalanceElement = (await screen.findByText('full account balance')).parentElement
    expect(transferableBalanceElement).toHaveTextContent('6,100.0000KSM')
  })

  describe('with paste account option', () => {
    beforeEach(() => {
      render(<AccountSelectTestComponent withAccountInput/>)
    })

    it('displays "Select account or paste account address" when no current account was set', async () => {
      await assertText('Select account or paste account address')
    })

    it('select toggle displays an input with placeholder', async () => {
      await openDropdown()

      const input = await screen.findByTestId('open-account-select-input')
      expect(input).toHaveAttribute('placeholder', 'Select account or paste account address')
    })

    it('closes list on enter', async () => {
      await openDropdown()

      const dropdownMenu = await screen.findByRole('list')
      const input = await screen.findByTestId('open-account-select-input')

      fireEvent.keyDown(input, { key: 'Enter', code: 13 })

      expect(dropdownMenu).not.toBeInTheDocument()
      expect(input).not.toBeInTheDocument()
    })

    it('sets account id', async () => {
      await openDropdown()

      const input = await screen.findByTestId('open-account-select-input')

      fireEvent.change(input, { target: { value: charlieAccount.address } })
      fireEvent.keyDown(input, { key: 'Enter', code: 13 })

      const updatedOpenDropdownButton = await screen.findByTestId('open-account-select')

      await within(updatedOpenDropdownButton).findByText(charlieAccount.address)
    })

    it('shows error message when account id is invalid', async () => {
      await openDropdown()

      const input = await screen.findByTestId('open-account-select-input')

      fireEvent.change(input, { target: { value: 'invalid' } })

      await screen.findByText('Invalid account address')
    })
  })

  it('can not be opened if disabled', async () => {
    render(<AccountSelectTestComponent disabled/>)

    const openDropdownButton = await openDropdown()
    expect(openDropdownButton).toHaveAttribute('disabled')

    const dropdownMenu = await screen.queryAllByRole('list')
    expect(dropdownMenu).toHaveLength(0)
  })
})

async function openDropdown() {
  const openDropdownButton = await screen.findByTestId('open-account-select')
  fireEvent.click(openDropdownButton)

  return openDropdownButton
}
