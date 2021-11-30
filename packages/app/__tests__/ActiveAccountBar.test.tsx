import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Home from '../pages'
import { mockUseBestNumber } from './mocks/mockUseBestNumber'
import { renderWithTheme, setLocalStorage } from './helpers'
import {
  bobAddressForActiveAccountBar,
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseActiveAccounts,
  mockUseApi,
  mockUseBalances
} from './mocks'

jest.mock('use-substrate/dist/src/hooks', () => ({
  useApi: () => mockUseApi,
  useAccounts: () => mockUseAccounts,
  useAssets: () => [],
  useBalances: () => mockUseBalances,
  useBestNumber: () => mockUseBestNumber,
  useActiveAccount: () => mockUseActiveAccount,
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

    await within(kusamaActiveAccount).findByText(bobAddressForActiveAccountBar)
    expect(kusamaActiveAccount).toHaveTextContent('kusama,6,000.0000KSM')
    expect(statemineActiveAccount).toHaveTextContent('statemine,6,000.0000KSM')
  })

  it('opens select account modal', async () => {
    userEvent.click(activeAccountBar)
    const openSelectAccountModalButton = await within(activeAccountBar).findByRole('button')
    userEvent.click(openSelectAccountModalButton)

    const modal = await screen.findByTestId('modal')
    await within(modal).findByText('Connect accounts')
  })

  it('displays current block', async () => {
    const kusamaActiveAccount = activeAccountBar.children[0] as HTMLElement
    const statemineActiveAccount = activeAccountBar.children[1] as HTMLElement

    expect(kusamaActiveAccount).toHaveTextContent('Current block#9,506,023')
    expect(statemineActiveAccount).toHaveTextContent('Current block#9,506,023')
  })
})
