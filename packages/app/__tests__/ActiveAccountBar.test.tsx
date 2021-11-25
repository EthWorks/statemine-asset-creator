import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Home from '../pages'
import { mockUseBestNumber } from './mocks/mockUseBestNumber'
import { renderWithTheme, setLocalStorage } from './helpers'
import { bobAccount, mockChains, mockUseAccounts, mockUseActiveAccounts, mockUseApi, mockUseBalances } from './mocks'

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => [],
  useBalances: () => mockUseBalances,
  useBestNumber: () => mockUseBestNumber,
  Chains: () => mockChains,
  useActiveAccounts: () => mockUseActiveAccounts
}))

describe('Active account bar', () => {
  let activeAccountBar: HTMLElement
  beforeEach(async () => {
    await act(async () => {
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')

      renderWithTheme(<Home/>)
      activeAccountBar = await screen.findByTestId('active-account-bar')
    })
  })

  it('displays balances and account address', async () => {
    const kusamaActiveAccount = activeAccountBar.children[0] as HTMLElement
    const statemineActiveAccount = activeAccountBar.children[1] as HTMLElement

    await within(kusamaActiveAccount).findByText(bobAccount.address)
    expect(kusamaActiveAccount).toHaveTextContent('Kusama6,000.0000KSM')
    expect(statemineActiveAccount).toHaveTextContent('Statemine6,000.0000KSM')
  })

  it('opens select account modal',async () => {
    userEvent.click(activeAccountBar)

    const modal = await screen.findByTestId('modal')
    await within(modal).findByText('Connect accounts')
  })

  it('displays current block', async () => {
    const kusamaActiveAccount = activeAccountBar.children[0] as HTMLElement
    const statemineActiveAccount = activeAccountBar.children[1] as HTMLElement

    await within(kusamaActiveAccount).findByText('Current block #9506023')
    await within(statemineActiveAccount).findByText('Current block #9506023')
  })
})
