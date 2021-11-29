import type { Account } from 'use-substrate'

import { render, screen, within } from '@testing-library/react'
import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { AccountSelect } from '../components'
import { theme } from '../styles/styleVariables'
import { assertText, openDropdown, selectAccountFromDropdown } from './helpers'
import { mockAccounts, mockUseAccounts, mockUseBalances, mockUseSubstrate } from './mocks'

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useBalances: () => mockUseBalances
}))

function AccountSelectTestComponent({ withFreeBalance, withAccountInput }: { withFreeBalance?: boolean, withAccountInput?: boolean }): JSX.Element {
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

    const openDropdownButton = await screen.findByRole('button')
    openDropdown(openDropdownButton)

    const dropdownMenu = await screen.findByRole('menu')

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

    it('select toggle displays account id input', async () => {
      const openDropdownButton = await screen.findByTestId('open-account-select')
      openDropdown(openDropdownButton)

      await screen.findByTestId('open-account-select-input')
    })
  })
})
