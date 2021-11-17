import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import { assertNoText, renderWithTheme, selectAccountFromDropdown, setLocalStorage } from './helpers'
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

    const connectModal = await screen.findByTestId('modal')
    const connectButton = await within(connectModal).findByRole('button', { name: 'Connect' })
    fireEvent.click(connectButton)

    expect(mockedSetter).toBeCalledWith(bobAccount.address)
    assertNoText('Connect accounts')
  })
})
