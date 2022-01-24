import { act, screen, waitFor } from '@testing-library/react'
import React from 'react'

import Home from '../pages'
import { POLKADOT_EXTENSION_LINK, TOS_PAGE_LINK } from '../utils'
import {
  assertLinkByText,
  assertLocalStorage,
  assertNewTabOpened,
  assertText,
  clickButton,
  renderWithTheme
} from './helpers'
import {
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseActiveAccounts,
  mockUseApi,
  mockUseAssets,
  mockUseBalances,
  mockUseBestNumber,
  mockUseChainToken,
  mockWeb3Enable
} from './mocks'

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useBalances: () => mockUseBalances,
  useBestNumber: () => mockUseBestNumber,
  useActiveAccounts: () => mockUseActiveAccounts,
  useActiveAccount: () => mockUseActiveAccount,
  useChainToken: () => mockUseChainToken
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

    await assertLinkByText('here', POLKADOT_EXTENSION_LINK, '_blank')
  })

  it('displays connect wallet modal when extension is not activated', async () => {
    renderWithTheme(<Home />)

    await screen.findByText('Connect extension to start using this app')
  })

  it('links to the "Terms of Service" page', async () => {
    renderWithTheme(<Home />)

    await assertText('By connecting, I accept')

    await assertLinkByText('Terms of Service', TOS_PAGE_LINK, '_blank')
  })
})
