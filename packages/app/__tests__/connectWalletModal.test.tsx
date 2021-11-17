import { act, screen, waitFor } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import { POLKADOT_EXTENSION_LINK } from '../utils'
import {
  assertLinkByText,
  assertLocalStorage,
  assertNewTabOpened,
  assertText,
  clickButton,
  renderWithTheme
} from './helpers'
import {
  mockChains,
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseApi,
  mockUseAssets,
  mockUseBalances,
  mockWeb3Enable
} from './mocks'

jest.mock('use-substrate', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useBalances: () => mockUseBalances,
  Chains: () => mockChains,
  useActiveAccount: () => mockUseActiveAccount
}))

describe('Connect wallet modal', () => {
  beforeEach(() => {
    act(() => {
      localStorage.clear()
    })
  })

  describe('on button click', () => {
    beforeEach(() => {
      act(() => {
        mockUseAccounts.extensionStatus = 'Available'
        mockWeb3Enable.mockClear()
      })
    })

    it('adds extensionActivated to localstorage and opens AccountSelect modal', async () => {
      assertLocalStorage('extensionActivated', null)
      renderWithTheme(<Home />)

      clickButton('Polkadot{.js} extension')

      await waitFor(() => expect(mockWeb3Enable).toBeCalled())

      assertLocalStorage('extensionActivated', 'true')

      await assertText('Connect accounts')
    })

    it('calls web3Enable', async () => {
      renderWithTheme(<Home />)

      expect(mockWeb3Enable).not.toHaveBeenCalled()

      clickButton('Polkadot{.js} extension')

      await waitFor(() => expect(mockWeb3Enable).toHaveBeenCalled())
    })

    it('when extension is not loaded, it opens install page', async () => {
      mockUseAccounts.extensionStatus = 'Unavailable'

      renderWithTheme(<Home />)

      clickButton('Polkadot{.js} extension')

      await waitFor(() => assertNewTabOpened(POLKADOT_EXTENSION_LINK))
    })
  })

  it('shows download prompt', async () => {
    renderWithTheme(<Home />)

    await assertText('Don’t have the Polkadot{.js} extension? Download it')

    await assertLinkByText('here', POLKADOT_EXTENSION_LINK)
  })

  it('displays connect wallet modal when extension is not activated', async () => {
    renderWithTheme(<Home />)

    await screen.findByText('Connect Wallet to start using app')
  })
})
