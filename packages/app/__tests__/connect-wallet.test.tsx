import type  { UseAccounts } from 'use-substrate'

import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import ConnectWallet from '../pages/connect-wallet'
import { theme } from '../styles/styleVariables'
import { POLKADOT_EXTENSION_LINK } from '../utils/consts'

const mockWeb3Enable = jest.fn()

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
    it('calls web3Enable', () => {
      renderConnectWallet()

      expect(mockWeb3Enable).not.toHaveBeenCalled()

      const enableWeb3Button = screen.getByRole('button', { name: 'Polkadot{.js} extension' })

      fireEvent.click(enableWeb3Button)
      expect(mockWeb3Enable).toHaveBeenCalled()
    })

    it('when extension is not loaded, it opens install page and shows download prompt', async () => {
      mockUseAccounts.extensionStatus = 'Unavailable'

      renderConnectWallet()

      const enableWeb3Button = screen.getByRole('button', { name: 'Polkadot{.js} extension' })

      fireEvent.click(enableWeb3Button)
      expect(global.open).toBeCalledWith(POLKADOT_EXTENSION_LINK, '_blank', 'noopener,noreferrer')
    })
  })

  it('shows download prompt', async () => {
    renderConnectWallet()

    await screen.findByText('Don’t have the Polkadot{.js} extension? Download it')
    const downloadExtensionLink = await screen.findByRole('link')
    expect(downloadExtensionLink.getAttribute('href')).toEqual(POLKADOT_EXTENSION_LINK)
  })
})
