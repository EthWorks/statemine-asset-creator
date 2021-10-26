import { act, fireEvent, render, screen, within } from '@testing-library/react'
import * as MockRouter from 'next-router-mock'
import { memoryRouter } from 'next-router-mock'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import AccountSelectPage from '../pages/account-select'
import { theme } from '../styles/styleVariables'
import { ACCOUNT_SELECT_URL, DASHBOARD_URL } from '../utils'
import { assertLocalStorage, clickButton, PointerEvent } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseBalances } from './mocks'

const renderAccountSelect = () => render(<ThemeProvider theme={theme}><AccountSelectPage /></ThemeProvider>)

jest.mock('use-substrate', () => ({
  useAccounts: () => mockUseAccounts,
  useBalances: () => mockUseBalances,
  Chains: () => mockChains
}))

jest.mock('next/dist/client/router', () => MockRouter)

describe('account-select page', () => {
  beforeEach(() => {
    act(() => {
      memoryRouter.setCurrentUrl(ACCOUNT_SELECT_URL)
      localStorage.clear()
    })
  })

  it('saves selected account to localstorage and redirects to dashboard', async () => {
    renderAccountSelect()

    assertLocalStorage('activeAccount', null)

    const openDropdownButton = await screen.findAllByRole('button')

    fireEvent.pointerDown(
      openDropdownButton[0],
      new PointerEvent('pointerdown', {
        ctrlKey: false,
        button: 0,
      })
    )

    const dropdownMenu = await screen.findByRole('menu')
    const menuItems = await within(dropdownMenu).findAllByRole('menuitem')

    fireEvent.click(menuItems[1])

    clickButton('Connect')

    assertLocalStorage('activeAccount', bobAccount.address)

    expect(memoryRouter.asPath).toEqual(DASHBOARD_URL)
  })
})
