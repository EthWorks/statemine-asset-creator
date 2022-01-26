import type { ActiveAccount } from 'use-substrate'

import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { Chains } from 'use-substrate'

import Home from '../pages'
import { theme } from '../styles/styleVariables'
import { AppChainsProvider, BN_ZERO as MOCK_BN_ZERO } from '../utils'
import {
  assertChainLogo,
  assertModalClosed,
  assertNoText,
  assertText,
  assertTextInAccountSelect,
  findAndClickButton,
  renderWithTheme,
  selectAccountFromDropdown,
  setLocalStorage,
  switchApiToPolkadot
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
  mockUseBalances,
  mockUseBestNumber,
  mockUseChainToken
} from './mocks'

const mockedSetter = jest.fn()
const mockedUseAccounts = mockUseAccounts
let mockActiveAccounts = {}
let mockRelayChainActiveAccount: ActiveAccount | undefined
let mockParachainActiveAccount: ActiveAccount | undefined

const mockActiveAccount = (chain: Chains) => {
  switch (chain) {
    case Chains.Kusama:
    case Chains.Polkadot:
      return mockRelayChainActiveAccount
    default:
      return mockParachainActiveAccount
  }
}

jest.mock('use-substrate/dist/src/hooks', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockedUseAccounts,
  useAssets: () => mockUseAssets,
  useBalances: () => ({ ...mockUseBalances, availableBalance: MOCK_BN_ZERO }),
  useBestNumber: () => mockUseBestNumber,
  useActiveAccounts: () => ({
    activeAccounts: mockActiveAccounts,
    setActiveAccounts: mockedSetter
  }),
  useActiveAccount: (chain: Chains) => ({
    ...mockUseActiveAccount,
    activeAccount: mockActiveAccount(chain)
  }),
  useChainToken: () => mockUseChainToken
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
    assertNoText('Add Kusama account')
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

    assertNumberOfSelectAccountDropdowns(2)

    await closeKusamaAccountDropdown()

    assertNumberOfSelectAccountDropdowns(1)
  })

  it('shows info about insufficient funds', async () => {
    renderWithTheme(<Home/>)

    await assertText('This account has insufficient funds, consider adding a Kusama account.')
  })

  it('shows info about kusama account', async () => {
    renderWithTheme(<Home/>)
    await findAndClickButton('Add Kusama account')

    assertNoText('This account has insufficient funds, consider adding Kusama account.')
    await assertText('Funds will be transferred to this Statemine account from your Kusama account.')
  })

  it('shows info if selected kusama account has no funds', async () => {
    renderWithTheme(<Home/>)
    await findAndClickButton('Add Kusama account')

    await assertText('Funds will be transferred to this Statemine account from your Kusama account.')
    assertNoText('This account has no funds')

    await selectAccountFromDropdown(1, 1)

    await assertText('This account has no funds')
  })

  it('clears kusama account when select is hidden', async () => {
    mockedUseAccounts.allAccounts = [aliceAccount, bobAccount]
    mockParachainActiveAccount = aliceActiveAccount
    mockRelayChainActiveAccount = bobActiveAccount
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
      mockParachainActiveAccount = charlieActiveAccount

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
      mockParachainActiveAccount = aliceActiveAccount
      mockRelayChainActiveAccount = charlieActiveAccount

      renderWithTheme(<Home/>)
      await openAccountSelectModal()

      await assertTextInAccountSelect('CHARLIE', 1)
    })

    it('does not show select for kusama when active account is not set', async () => {
      mockedUseAccounts.allAccounts = [aliceAccount, charlieAccount]
      mockParachainActiveAccount = aliceActiveAccount

      renderWithTheme(<Home/>)
      await openAccountSelectModal()

      assertNumberOfSelectAccountDropdowns(1)
    })
  })

  it('clears not applied changes on modal close', async () => {
    mockedUseAccounts.allAccounts = [aliceAccount, charlieAccount]
    mockParachainActiveAccount = aliceActiveAccount
    renderWithTheme(<Home/>)

    await openAccountSelectModal()
    assertNumberOfSelectAccountDropdowns(1)

    await findAndClickButton('Add Kusama account')
    assertNumberOfSelectAccountDropdowns(2)
    await selectAccountFromDropdown(0, 1)

    await findAndClickButton('X')
    assertModalClosed()
    await openAccountSelectModal()

    assertNumberOfSelectAccountDropdowns(1)

    await findAndClickButton('Add Kusama account')
    await assertTextInAccountSelect('Select account', 1)
  })

  it('hides "Add kusama account" button on app load if it was already set', async () => {
    mockedUseAccounts.allAccounts = [aliceAccount, charlieAccount]
    mockParachainActiveAccount = aliceActiveAccount
    mockRelayChainActiveAccount = charlieActiveAccount

    renderWithTheme(<Home/>)

    await openAccountSelectModal()
    assertNumberOfSelectAccountDropdowns(2)
    assertNoText('Add Kusama account')
  })

  describe('on api change', () => {
    it('updates displayed chain names', async () => {
      mockParachainActiveAccount = aliceActiveAccount
      mockRelayChainActiveAccount = undefined

      renderWithTheme(<AppChainsProvider><Home/></AppChainsProvider>)
      await switchApiToPolkadot()

      await openAccountSelectModal()
      const modal = await screen.findByTestId('modal')

      expect(modal).toHaveTextContent('Statemint account')
      expect(modal).not.toHaveTextContent('Statemine account')
      expect(modal).toHaveTextContent('Polkadot account')
      expect(modal).not.toHaveTextContent('Kusama account')
      expect(modal).toHaveTextContent('Asset creation and transfers happen on the Statemint parachain. You need an account with a balance on Statemint for fees and deposits. However, you can also use a fresh & empty account, and send funds from your Polkadot account.')
      expect(modal).toHaveTextContent('This account has insufficient funds, consider adding a Polkadot account.')
    })

    it('updates displayed chain icons', async () => {
      mockedUseAccounts.allAccounts = [aliceAccount, charlieAccount]
      mockParachainActiveAccount = aliceActiveAccount
      mockRelayChainActiveAccount = charlieActiveAccount

      renderWithTheme(<AppChainsProvider><Home/></AppChainsProvider>)
      await openAccountSelectModal()
      const modal = await screen.findByTestId('modal')

      await assertChainLogo(Chains.Statemine, modal)
      await assertChainLogo(Chains.Kusama, modal)

      await switchApiToPolkadot()

      await assertChainLogo(Chains.Statemint, modal)
      await assertChainLogo(Chains.Polkadot, modal)
    })
  })

  afterEach(() => {
    mockedUseAccounts.allAccounts = [aliceAccount, bobAccount]
    mockParachainActiveAccount = undefined
    mockRelayChainActiveAccount = undefined
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
