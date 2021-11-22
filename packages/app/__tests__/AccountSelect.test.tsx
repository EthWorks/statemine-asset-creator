import type { Account } from 'use-substrate'

import { render, screen, within } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { AccountSelect } from '../components'
import { theme } from '../styles/styleVariables'
import { openDropdown, selectAccountFromDropdown } from './helpers'
import { mockAccounts, mockChains, mockUseAccounts, mockUseBalances, mockUseSubstrate } from './mocks'

jest.mock('use-substrate', () => ({
  useAccounts: () => mockUseAccounts,
  useBalances: () => mockUseBalances,
  Chains: () => mockChains,
}))

function AccountSelectTestComponent(): JSX.Element {
  const accounts = mockUseSubstrate.useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  return (
    <ThemeProvider theme={theme}>
      <AccountSelect
        accounts={accounts.allAccounts}
        currentAccount={account}
        setCurrentAccount={setAccount}
      />
    </ThemeProvider>
  )
}

describe('AccountSelect component', () => {
  it('displays current account info on load', async () => {
    render(<AccountSelectTestComponent/>)

    await screen.findByText(mockAccounts[0].name)
    await screen.findByText(mockAccounts[0].address)

    const transferableBalanceElement = (await screen.findByText('transferable balance')).parentElement
    expect(transferableBalanceElement).toHaveTextContent('4,000.0000KSM')
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

    await selectAccountFromDropdown(1)

    const openDropdownButton = await screen.findByRole('button')
    await within(openDropdownButton).findByText('BOB')
    expect(await within(openDropdownButton).queryAllByAltText('ALICE')).toHaveLength(0)
  })
})
