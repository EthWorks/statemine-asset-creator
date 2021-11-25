import { act, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'

import { Chains } from 'use-substrate'

import Home from '../pages'
import { BN_ZERO } from '../utils'
import {
  assertNoText, assertText,
  findAndClickButton,
  findButtonNotDisabled,
  renderWithTheme,
  selectAccountFromDropdown,
  setLocalStorage
} from './helpers'
import { aliceAccount, bobAccount, mockUseAccounts, mockUseApi, mockUseAssets, mockUseBalances } from './mocks'

const mockedSetter = jest.fn()

let mockFreeBalance = mockUseBalances.freeBalance

jest.mock('use-substrate/dist/src/hooks', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => mockUseAssets,
  useBalances: () => ({
    ...mockUseBalances,
    freeBalance: mockFreeBalance
  }),
  useActiveAccounts: () => ({
    activeAccounts: {},
    setActiveAccounts: mockedSetter
  })
}))

describe('Account select modal', () => {
  beforeEach(() => {
    act(() => {
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')
    })
  })

  it('saves selected accounts with useActiveAccount hook and closes modal', async () => {
    renderWithTheme(<Home />)
    await selectAccountFromDropdown(0, 1)
    await clickConnect()

    expect(mockedSetter).toBeCalledWith({
      [Chains.Statemine]: bobAccount.address
    })
    assertNoText('Connect accounts')
  })

  describe('if statemine account has no funds', () => {
    beforeAll(() => {
      mockFreeBalance = BN_ZERO
    })

    afterAll(() => {
      mockFreeBalance = mockUseBalances.freeBalance
    })

    it('shows "Add Kusama account" button', async () => {
      renderWithTheme(<Home/>)

      await findButtonNotDisabled('Add Kusama account')
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
        [Chains.Kusama]: aliceAccount.address,
        [Chains.Statemine]: bobAccount.address
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
