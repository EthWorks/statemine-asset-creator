import { act } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import {
  assertLocalStorage,
  assertNoText,
  clickButton,
  renderWithTheme,
  selectAccountFromDropdown,
  setLocalStorage
} from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseAssets, mockUseBalances } from './mocks'

jest.mock('use-substrate', () => ({
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
    clickButton('Connect')

    assertLocalStorage('activeAccount', bobAccount.address)
    assertNoText('Connect accounts')
  })
})
