import { act } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import { assertNoText, clickButton, renderWithTheme, selectAccountFromDropdown, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseApi, mockUseAssets, mockUseBalances } from './mocks'

const mockedSetter = jest.fn()

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => mockUseAssets,
  useBalances: () => mockUseBalances,
  Chains: () => mockChains,
  useActiveAccount: () => ({
    activeAccount: undefined,
    setActiveAccount: mockedSetter
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
    clickButton('Connect')

    expect(mockedSetter).toBeCalledWith(bobAccount.address)
    assertNoText('Connect accounts')
  })
})
