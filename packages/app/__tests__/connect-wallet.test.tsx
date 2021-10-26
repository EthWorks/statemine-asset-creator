import { act, render, waitFor } from '@testing-library/react'
import * as MockRouter from 'next-router-mock'
import { memoryRouter } from 'next-router-mock'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import ConnectWallet from '../pages/connect-wallet'
import { theme } from '../styles/styleVariables'
import { POLKADOT_EXTENSION_LINK } from '../utils/consts'
import { mockUseAccounts, mockWeb3Enable } from './mocks/mockUseAccounts'
import { assertLink, assertLocalStorage, assertNewTabOpened, assertText, clickButton, setLocalStorage } from './helpers'

jest.mock('next/dist/client/router', () => MockRouter)

jest.mock('use-substrate', () => ({
  useAccounts: () => (mockUseAccounts),
}))

const renderConnectWallet = () => render(<ThemeProvider theme={theme}><ConnectWallet /></ThemeProvider>)

describe('Connect wallet', () => {
  describe('on button click', () => {
    beforeEach(() => {
      act(() => {
        memoryRouter.setCurrentUrl('/connect-wallet')
        localStorage.clear()
        mockUseAccounts.extensionStatus = 'Available'
        mockWeb3Enable.mockClear()
      })
    })

    it('adds extensionActivated to localstorage and redirects to dashboard', async () => {
      renderConnectWallet()

      assertLocalStorage('extensionActivated', null)

      clickButton('Polkadot{.js} extension')

      await waitFor(() => expect(mockWeb3Enable).toBeCalled())

      assertLocalStorage('extensionActivated', 'true')

      expect(memoryRouter.asPath).toEqual('/')
    })

    it('calls web3Enable', async () => {
      renderConnectWallet()

      expect(mockWeb3Enable).not.toHaveBeenCalled()

      clickButton('Polkadot{.js} extension')

      await waitFor(() => expect(mockWeb3Enable).toHaveBeenCalled())
    })

    it('when extension is not loaded, it opens install page and shows download prompt', async () => {
      mockUseAccounts.extensionStatus = 'Unavailable'

      renderConnectWallet()

      clickButton('Polkadot{.js} extension')

      await waitFor(() => assertNewTabOpened(POLKADOT_EXTENSION_LINK))
    })
  })

  it('shows download prompt', async () => {
    renderConnectWallet()

    await assertText('Don’t have the Polkadot{.js} extension? Download it')

    await assertLink(POLKADOT_EXTENSION_LINK)
  })

  it('on load redirects to dashboard if extension has already been activated', async () => {
    setLocalStorage('extensionActivated', 'true')

    renderConnectWallet()

    await waitFor(() => expect(mockWeb3Enable).toBeCalled())

    expect(memoryRouter.asPath).toEqual('/')
  })
})
