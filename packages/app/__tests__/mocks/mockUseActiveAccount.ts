import { noop } from '../helpers'
import { bobAccountId } from './mockAccounts'

export const mockUseActiveAccount = {
  activeAccount: { address: bobAccountId, name: 'BOB' },
  setActiveAccount: noop
}
