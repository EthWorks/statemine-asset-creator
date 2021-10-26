import { render, screen } from '@testing-library/react'
import React from 'react'

import Home from '../pages/index'
import { bobAccount } from './mocks/mockAccounts'
import { assertText, setLocalStorage } from './helpers'

jest.mock('use-substrate', () => ({
  useBalances: () => ({
    freeBalance: 3600,
    availableBalance: 4000,
    lockedBalance: 300,
    accountNonce: 1
  }),
  useAccounts: () => ({
    allAccounts: [],
    hasAccounts: false
  }),
  Chains: () => ({
    Kusama: 'kusama',
    Statemine: 'statemine'
  })
}))

describe('Home', () => {
  it('displays kusama balance of selected account', async () => {
    setLocalStorage('activeAccount', bobAccount.address)
    render(<Home />)

    screen.getByRole('heading', { name: /welcome to Statemine/i })
    const activeAccountContainer = screen.getByTestId('active-account-container')
    expect(activeAccountContainer).toHaveTextContent(bobAccount.address)

    await assertText('Balance: 3600')
  })
})
