import type { ActiveAccount } from 'use-substrate'

import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { Chains } from 'use-substrate'

import Home from '../pages'
import { theme } from '../styles/styleVariables'
import { BN_ZERO as MOCK_BN_ZERO } from '../utils'
import { mockUseBestNumber } from './mocks/mockUseBestNumber'
import {
  assertNoText,
  assertText,
  assertTextInAccountSelect,
  findAndClickButton,
  renderWithTheme,
  selectAccountFromDropdown,
  setLocalStorage
} from './helpers'
import {
  aliceAccount,
  aliceActiveAccount,
  bobAccount,
  bobActiveAccount,
  charlieAccount,
  charlieActiveAccount,
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseApi,
  mockUseAssets,
  mockUseBalances
} from './mocks'

const mockedSetter = jest.fn()
const mockedUseAccounts = mockUseAccounts
let mockActiveAccounts = {}
let mockKusamaActiveAccount: ActiveAccount | undefined
let mockStatemineActiveAccount: ActiveAccount | undefined

const mockActiveAccount = (chain: Chains) => {
  switch (chain) {
    case Chains.Kusama:
      return mockKusamaActiveAccount
    default:
      return mockStatemineActiveAccount
  }
}

jest.mock('use-substrate/dist/src/hooks', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockedUseAccounts,
  useAssets: () => mockUseAssets,
  useBalances: () => ({ ...mockUseBalances, freeBalance: MOCK_BN_ZERO }),
  useBestNumber: () => mockUseBestNumber,
  useActiveAccounts: () => ({
    activeAccounts: mockActiveAccounts,
    setActiveAccounts: mockedSetter
  }),
  useActiveAccount: (chain: Chains) => ({
    ...mockUseActiveAccount,
    activeAccount: mockActiveAccount(chain)
  })
}))

describe('Account select modal', () => {
  beforeEach(() => {
    act(() => {
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')
      jest.resetAllMocks()
    })
  })

  it('saves selected accounts with useActiveAccount hook and closes modal', async () => {
    renderWithTheme(<Home />)
    await selectAccountFromDropdown(0, 1)
    await clickConnect()

    expect(mockedSetter).toBeCalledWith({
      [Chains.Kusama]: undefined,
      [Chains.Statemine]: bobAccount
    })
    assertNoText('Connect accounts')
  })

  it('button click displays account select for kusama account', async () => {
    renderWithTheme(<Home/>)
    await findAndClickButton('Add Kusama account')

    assertNumberOfSelectAccountDropdowns(2)
    await assertNoText('Add Kusama account')
  })

  it('can set statemine and kusama account', async () => {
    renderWithTheme(<Home />)
    await selectAccountFromDropdown(0, 1)
    await findAndClickButton('Add Kusama account')
    await selectAccountFromDropdown(1, 0)
    await clickConnect()

    expect(mockedSetter).toBeCalledWith({
      [Chains.Kusama]: aliceAccount,
      [Chains.Statemine]: bobAccount
    })
  })

  it('hides kusama account select', async () => {
    renderWithTheme(<Home/>)
    await findAndClickButton('Add Kusama account')

    await assertNumberOfSelectAccountDropdowns(2)

    await closeKusamaAccountDropdown()

    await assertNumberOfSelectAccountDropdowns(1)
  })

  it('shows info about insufficient funds', async () => {
    renderWithTheme(<Home/>)

    await assertText('This account has insufficient funds, consider adding Kusama account.')
  })

  it('shows info about kusama account', async () => {
    renderWithTheme(<Home/>)
    await findAndClickButton('Add Kusama account')

    await assertNoText('This account has insufficient funds, consider adding Kusama account.')
    await assertText('Funds will be transferred to this Statemine account from your Kusama account.')
  })

  it('shows info if selected kusama account has no funds', async () => {
    renderWithTheme(<Home/>)
    await findAndClickButton('Add Kusama account')

    await assertText('Funds will be transferred to this Statemine account from your Kusama account.')
    await assertText('This account has no funds')
  })

  it('clears kusama account when select is hidden', async () => {
    mockedUseAccounts.allAccounts = [aliceAccount, bobAccount]
    mockStatemineActiveAccount = aliceActiveAccount
    mockKusamaActiveAccount = bobActiveAccount
    mockActiveAccounts = { kusama: aliceAccount, statemine: bobAccount }

    renderWithTheme(<Home/>)

    await openAccountSelectModal()

    await assertTextInAccountSelect('BOB', 1)
    await closeKusamaAccountDropdown()

    await clickConnect()

    expect(mockedSetter).toBeCalledWith({
      [Chains.Kusama]: undefined,
      [Chains.Statemine]: aliceAccount
    })
  })

  describe('uses active account', () => {
    it('shows current active account', async () => {
      mockedUseAccounts.allAccounts = [charlieAccount]
      mockStatemineActiveAccount = charlieActiveAccount

      renderWithTheme(<Home/>)

      await openAccountSelectModal()
      await assertTextInAccountSelect('CHARLIE', 0)
    })

    it('shows prompt to select account when account was removed from extension', async () => {
      const { rerender } = renderWithTheme(<Home/>)
      await selectAccountFromDropdown(0, 1)
      await clickConnect()

      mockedUseAccounts.allAccounts = [aliceAccount]
      rerender(<ThemeProvider theme={theme}><Home/></ThemeProvider>)
      await assertTextInAccountSelect('Select account', 0)
    })

    it('shows account select for kusama if there is active account', async () => {
      mockedUseAccounts.allAccounts = [aliceAccount, charlieAccount]
      mockStatemineActiveAccount = aliceActiveAccount
      mockKusamaActiveAccount = charlieActiveAccount

      renderWithTheme(<Home/>)
      await openAccountSelectModal()

      await assertTextInAccountSelect('CHARLIE', 1)
    })

    it('does not show select for kusama when active account is not set', async () => {
      mockedUseAccounts.allAccounts = [aliceAccount, charlieAccount]
      mockStatemineActiveAccount = aliceActiveAccount

      renderWithTheme(<Home/>)
      await openAccountSelectModal()

      await assertNumberOfSelectAccountDropdowns(1)
    })
  })

  afterEach(() => {
    mockedUseAccounts.allAccounts = [aliceAccount, bobAccount]
    mockStatemineActiveAccount = undefined
    mockKusamaActiveAccount = undefined
    mockActiveAccounts = {}
  })
})

const clickConnect = async () => {
  const connectModal = await screen.findByTestId('modal')
  const connectButton = await within(connectModal).findByRole('button', { name: 'Connect' })

  fireEvent.click(connectButton)
}

const closeKusamaAccountDropdown = async () => {
  const closeAccountSelect = await screen.findByTestId('close-account-select')

  fireEvent.click(closeAccountSelect)
}

const assertNumberOfSelectAccountDropdowns = (number: number) => {
  const accountSelects = screen.getAllByTestId('open-account-select')

  expect(accountSelects).toHaveLength(number)
}

const openAccountSelectModal = async () => {
  const activeAccountBar = await screen.findByTestId('active-account-bar')
  const editButton = await within(activeAccountBar).findByRole('button')

  fireEvent.click(editButton)
}
