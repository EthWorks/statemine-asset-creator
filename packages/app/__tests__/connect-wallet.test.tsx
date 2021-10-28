import { act, waitFor } from '@testing-library/react'
import * as MockRouter from 'next-router-mock'
import { memoryRouter } from 'next-router-mock'
import React from 'react'

import ConnectWallet from '../pages/connect-wallet'
import { ACCOUNT_SELECT_URL, CONNECT_WALLET_URL, POLKADOT_EXTENSION_LINK } from '../utils'
import {
  assertLink,
  assertLocalStorage,
  assertNewTabOpened,
  assertText,
  clickButton,
  renderComponent,
  setLocalStorage
} from './helpers'
import { mockUseAccounts, mockWeb3Enable } from './mocks'

jest.mock('next/dist/client/router', () => MockRouter)

jest.mock('use-substrate', () => ({
  useAccounts: () => mockUseAccounts,
}))

describe('Connect wallet', () => {
  describe('on button click', () => {
    beforeEach(() => {
      act(() => {
        memoryRouter.setCurrentUrl(CONNECT_WALLET_URL)
        localStorage.clear()
        mockUseAccounts.extensionStatus = 'Available'
        mockWeb3Enable.mockClear()
      })
    })

    it('adds extensionActivated to localstorage and redirects to account-select page', async () => {
      renderComponent(<ConnectWallet />)

      assertLocalStorage('extensionActivated', null)

      clickButton('Polkadot{.js} extension')

      await waitFor(() => expect(mockWeb3Enable).toBeCalled())

      assertLocalStorage('extensionActivated', 'true')

      expect(memoryRouter.asPath).toEqual(ACCOUNT_SELECT_URL)
    })

    it('calls web3Enable', async () => {
      renderComponent(<ConnectWallet />)

      expect(mockWeb3Enable).not.toHaveBeenCalled()

      clickButton('Polkadot{.js} extension')

      await waitFor(() => expect(mockWeb3Enable).toHaveBeenCalled())
    })

    it('when extension is not loaded, it opens install page', async () => {
      mockUseAccounts.extensionStatus = 'Unavailable'

      renderComponent(<ConnectWallet />)

      clickButton('Polkadot{.js} extension')

      await waitFor(() => assertNewTabOpened(POLKADOT_EXTENSION_LINK))
    })
  })

  it('shows download prompt', async () => {
    renderComponent(<ConnectWallet />)

    await assertText('Don’t have the Polkadot{.js} extension? Download it')

    await assertLink(POLKADOT_EXTENSION_LINK)
  })

  it('on load redirects to account-select page if extension has already been activated', async () => {
    setLocalStorage('extensionActivated', 'true')

    renderComponent(<ConnectWallet />)

    await waitFor(() => expect(mockWeb3Enable).toBeCalled())

    expect(memoryRouter.asPath).toEqual(ACCOUNT_SELECT_URL)
  })
})
