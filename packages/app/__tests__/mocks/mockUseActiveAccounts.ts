import { Chains } from 'use-substrate'

import { noop } from '../helpers'
import { bobActiveAccount } from './mockAccounts'

export const mockUseActiveAccounts = {
  activeAccounts: { [Chains.Kusama]: bobActiveAccount, [Chains.Statemine]: bobActiveAccount },
  setActiveAccounts: noop
}
