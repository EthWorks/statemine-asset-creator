import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Home from '../pages'
import { assertText, renderWithTheme, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseActiveAccounts, mockUseApi, mockUseBalances } from './mocks'

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => [],
  useBalances: () => mockUseBalances,
  Chains: () => mockChains,
  useActiveAccounts: () => mockUseActiveAccounts
}))

describe('Active account bar', () => {
  beforeEach(() => {
    act(() => {
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')
    })
  })

  it('displays balances and account address', async () => {
    renderWithTheme(<Home/>)

    await assertText(bobAccount.address)
    await assertText('KUSAMA 6000000000000000 KSM')
    await assertText('STATEMINE 6000000000000000 KSM')
  })

  it('opens select account modal',async () => {
    renderWithTheme(<Home/>)
    const activeAccountBar = await screen.findByTestId('active-account-bar')
    userEvent.click(activeAccountBar)

    const modal = await screen.findByTestId('modal')
    await within(modal).findByText('Connect accounts')
  })
})
