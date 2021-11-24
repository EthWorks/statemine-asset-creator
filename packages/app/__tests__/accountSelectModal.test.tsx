import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import { Chains } from 'use-substrate'

import Home from '../pages'
import { BN_ZERO } from '../utils'
import { assertNoText, findAndClickButton, renderWithTheme, selectAccountFromDropdown, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseApi, mockUseAssets, mockUseBalances } from './mocks'

const mockedSetter = jest.fn()

let mockFreeBalance = mockUseBalances.freeBalance

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => mockUseAssets,
  useBalances: () => ({
    ...mockUseBalances,
    freeBalance: mockFreeBalance
  }),
  Chains: () => mockChains,
  useActiveAccounts: () => ({
    activeAccounts: {},
    setActiveAccounts: mockedSetter
  })
}))

describe('Account select modal', () => {
  beforeEach(() => {
    act(() => {
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')
    })
  })

  it('saves selected account with useActiveAccount hook and closes modal', async () => {
    renderWithTheme(<Home />)
    await selectAccountFromDropdown(1)

    const connectModal = await screen.findByTestId('modal')
    const connectButton = await within(connectModal).findByRole('button', { name: 'Connect' })
    fireEvent.click(connectButton)

    expect(mockedSetter).toBeCalledWith(Chains.Kusama, bobAccount.address)
    assertNoText('Connect accounts')
  })

  describe('if statemine account has no funds', () => {
    beforeAll(() => {
      mockFreeBalance = BN_ZERO
    })

    afterAll(() => {
      mockFreeBalance = mockUseBalances.freeBalance
    })

    it('shows "Add Kusama account" button', async () => {
      renderWithTheme(<Home />)

      const button = await screen.findByRole('button', { name: 'Add Kusama account' })

      expect(button).not.toBeDisabled()
    })

    it('button click displays account select for kusama account', async () => {
      renderWithTheme(<Home />)

      await findAndClickButton('Add Kusama account')
      
      const accountSelects = screen.getAllByTestId('open-account-select')
      expect(accountSelects).toHaveLength(2)
    })
  })
})
