import { Chains } from 'use-substrate'

import { noop } from '../helpers'
import { bobAccountId } from './mockAccounts'

export const mockUseActiveAccounts = {
  activeAccounts: { [Chains.Kusama]: { address: bobAccountId }, [Chains.Statemine]: { address: bobAccountId } },
  setActiveAccounts: noop
}
