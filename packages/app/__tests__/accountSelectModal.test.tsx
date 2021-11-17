import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import { assertLocalStorage, assertNoText, renderWithTheme, selectAccountFromDropdown, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseApi, mockUseAssets, mockUseBalances } from './mocks'

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => mockUseAssets,
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

  it('saves selected account to localstorage and closes modal', async () => {
    assertLocalStorage('activeAccount', null)

    renderWithTheme(<Home />)
    await selectAccountFromDropdown(1)

    const connectModal = await screen.findByTestId('modal')
    const connectButton = await within(connectModal).findByRole('button', { name: 'Connect' })
    fireEvent.click(connectButton)

    assertLocalStorage('activeAccount', bobAccount.address)
    assertNoText('Connect accounts')
  })
})
