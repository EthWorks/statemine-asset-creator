import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import { assertLocalStorage, assertNoText, clickButton, openDropdown, renderWithTheme, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseBalances } from './mocks'

jest.mock('use-substrate', () => ({
  useAccounts: () => mockUseAccounts,
  useBalances: () => mockUseBalances,
  Chains: () => mockChains
}))

describe('Account select modal', () => {
  beforeEach(() => {
    act(() => {
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')
    })
  })

  async function selectAccountFromDropdown(accountIndex: number) {
    const openDropdownButton = await screen.findByTestId('open-account-select')
    openDropdown(openDropdownButton)
    const dropdownMenu = await screen.findByRole('menu')
    const menuItems = await within(dropdownMenu).findAllByRole('menuitem')

    fireEvent.click(menuItems[accountIndex])
  }

  it('saves selected account to localstorage and closes modal', async () => {
    assertLocalStorage('activeAccount', null)

    renderWithTheme(<Home />)
    await selectAccountFromDropdown(1)
    clickButton('Connect')

    assertLocalStorage('activeAccount', bobAccount.address)
    assertNoText('Connect accounts')
  })
})
