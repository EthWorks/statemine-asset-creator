import { Chains } from 'use-substrate'

import { bobAccountId } from './mockAccounts'

export const mockUseActiveAccounts = {
  activeAccounts: { [Chains.Kusama]: bobAccountId, [Chains.Statemine]: bobAccountId },
  setActiveAccounts: () => {/**/}
}
