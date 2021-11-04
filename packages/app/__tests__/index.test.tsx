import { act, screen } from '@testing-library/react'
import React from 'react'

import Home from '../pages/index'
import { assertNoButton, assertText, clickButton, renderWithTheme, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseAssets, mockUseBalances, mockWeb3Enable } from './mocks'

jest.mock('use-substrate', () => ({
  useBalances: () => mockUseBalances,
  useAccounts: () => mockUseAccounts,
  useAssets: () => mockUseAssets,
  Chains: () => mockChains
}))

describe('Home', () => {
  beforeEach(() => {
    act(() => {
      mockWeb3Enable.mockClear()
      localStorage.clear()
      setLocalStorage('activeAccount', bobAccount.address)
      setLocalStorage('extensionActivated', 'true')
    })
  })

  it('displays kusama balance of selected account', async () => {
    renderWithTheme(<Home/>)

    screen.getByRole('heading', { name: /welcome to Statemine/i })
    const activeAccountContainer = screen.getByTestId('active-account-container')
    expect(activeAccountContainer).toHaveTextContent(bobAccount.address)

    await assertText('Balance: 3600')
  })

  it('opens create asset modal', async () => {
    renderWithTheme(<Home/>)

    clickButton('Create new asset')

    await assertText('Create asset')
    assertNoButton('Create new asset')

    await screen.findByLabelText('Asset name')
    await screen.findByLabelText('Asset symbol')
    await screen.findByLabelText('Asset decimals')
    await screen.findByLabelText('Asset ID')
  })
})
