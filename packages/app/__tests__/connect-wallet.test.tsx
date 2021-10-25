import type { UseAccounts } from 'use-substrate'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as MockRouter from 'next-router-mock'
import { memoryRouter } from 'next-router-mock'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import ConnectWallet from '../pages/connect-wallet'
import { theme } from '../styles/styleVariables'
import { POLKADOT_EXTENSION_LINK } from '../utils/consts'

const mockWeb3Enable = jest.fn().mockResolvedValue('')
jest.mock('next/dist/client/router', () => MockRouter)

jest.mock('use-substrate', () => ({
  useAccounts: () => (mockUseAccounts),
}))

const mockUseAccounts: UseAccounts = {
  allAccounts: [],
  hasAccounts: false,
  web3Enable: mockWeb3Enable,
  extensionStatus: 'Available'
}

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

      expect(localStorage.getItem('extensionActivated')).toEqual(null)

      const enableWeb3Button = screen.getByRole('button', { name: 'Polkadot{.js} extension' })

      fireEvent.click(enableWeb3Button)

      await waitFor(() => expect(mockWeb3Enable).toBeCalled())

      expect(localStorage.getItem('extensionActivated')).toEqual('true')
      expect(memoryRouter.asPath).toEqual('/')
    })

    it('calls web3Enable', async () => {
      renderConnectWallet()

      expect(mockWeb3Enable).not.toHaveBeenCalled()

      const enableWeb3Button = screen.getByRole('button', { name: 'Polkadot{.js} extension' })

      fireEvent.click(enableWeb3Button)
      await waitFor(() => expect(mockWeb3Enable).toHaveBeenCalled())
    })

    it('when extension is not loaded, it opens install page and shows download prompt', async () => {
      mockUseAccounts.extensionStatus = 'Unavailable'

      renderConnectWallet()

      const enableWeb3Button = screen.getByRole('button', { name: 'Polkadot{.js} extension' })

      fireEvent.click(enableWeb3Button)
      await (waitFor(() => expect(global.open).toBeCalledWith(POLKADOT_EXTENSION_LINK, '_blank', 'noopener,noreferrer')))
    })
  })

  it('shows download prompt', async () => {
    renderConnectWallet()

    await screen.findByText('Don’t have the Polkadot{.js} extension? Download it')
    const downloadExtensionLink = await screen.findByRole('link')
    expect(downloadExtensionLink.getAttribute('href')).toEqual(POLKADOT_EXTENSION_LINK)
  })

  it('on load redirects to dashboard if extension has already been activated', async () => {
    localStorage.setItem('extensionActivated', 'true')
    renderConnectWallet()
    await waitFor(() => expect(mockWeb3Enable).toBeCalled())

    expect(memoryRouter.asPath).toEqual('/')
  })
})
