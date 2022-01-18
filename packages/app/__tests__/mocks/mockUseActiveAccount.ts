import { noop } from '../helpers'
import { bobActiveAccount } from './mockAccounts'

export const mockUseActiveAccount = {
  activeAccount: bobActiveAccount,
  setActiveAccount: noop,
  isLoaded: true
}
