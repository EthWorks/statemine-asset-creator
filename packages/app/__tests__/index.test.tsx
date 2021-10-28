import { act, screen, waitFor } from '@testing-library/react'
import * as MockRouter from 'next-router-mock'
import { memoryRouter } from 'next-router-mock'
import React from 'react'

import Home from '../pages/index'
import { ACCOUNT_SELECT_URL, CONNECT_WALLET_URL, DASHBOARD_URL } from '../utils'
import { assertNoButton, assertText, clickButton, renderComponent, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseBalances, mockWeb3Enable } from './mocks'

jest.mock('next/dist/client/router', () => MockRouter)

jest.mock('use-substrate', () => ({
  useBalances: () => mockUseBalances,
  useAccounts: () => mockUseAccounts,
  Chains: () => mockChains
}))

describe('Home', () => {
  beforeEach(() => {
    act(() => {
      mockWeb3Enable.mockClear()
      memoryRouter.setCurrentUrl('/')
      localStorage.clear()
    })
  })

  describe('redirect on load', () => {
    it('when extension was not activated', async () => {
      renderComponent(<Home/>)

      await waitFor(() => expect(memoryRouter.asPath).toEqual(CONNECT_WALLET_URL))
    })

    it('when extension was activated but activeAccount was not selected', async () => {
      setLocalStorage('extensionActivated', 'true')

      renderComponent(<Home/>)

      await waitFor(() => expect(mockWeb3Enable).toBeCalled())
      await waitFor(() => expect(memoryRouter.asPath).toEqual(ACCOUNT_SELECT_URL))
    })

    it('when extension activated and account selected', async () => {
      setLocalStorage('extensionActivated', 'true')
      setLocalStorage('activeAccount', bobAccount.address)

      renderComponent(<Home/>)

      await waitFor(() => expect(mockWeb3Enable).toBeCalled())
      await waitFor(() => expect(memoryRouter.asPath).toEqual(DASHBOARD_URL))
    })
  })

  it('displays kusama balance of selected account', async () => {
    setLocalStorage('activeAccount', bobAccount.address)
    setLocalStorage('extensionActivated', 'true')

    renderComponent(<Home/>)

    screen.getByRole('heading', { name: /welcome to Statemine/i })
    const activeAccountContainer = screen.getByTestId('active-account-container')
    expect(activeAccountContainer).toHaveTextContent(bobAccount.address)

    await assertText('Balance: 3600')
  })

  it('opens create asset modal', async () => {
    setLocalStorage('activeAccount', bobAccount.address)
    setLocalStorage('extensionActivated', 'true')

    renderComponent(<Home/>)

    clickButton('Create new asset')

    await assertText('Create asset')
    assertNoButton('Create new asset')

    await screen.findByLabelText('Asset name')
    await screen.findByLabelText('Asset symbol')
    await screen.findByLabelText('Asset decimals')
    await screen.findByLabelText('Asset ID')
  })
})
