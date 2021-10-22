import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import ConnectWallet from '../pages/connect-wallet'

const mockWeb3Enable = jest.fn()

jest.mock('use-substrate', () => ({
  useAccounts: () => ({
    allAccounts: [],
    hasAccounts: false,
    web3Enable: mockWeb3Enable
  }),
}))

describe('Connect wallet', () => {
  it('calls web3Enable on button click', async () => {
    render(<ConnectWallet />)

    expect(mockWeb3Enable).not.toHaveBeenCalled()

    const enableWeb3Button = screen.getByRole('button', { name: 'Polkadot{.js} extension' })

    fireEvent.click(enableWeb3Button)
    expect(mockWeb3Enable).toHaveBeenCalled()
  })
})
