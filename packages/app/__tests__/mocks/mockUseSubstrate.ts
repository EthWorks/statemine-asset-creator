import BN from 'bn.js'

import { mockAccounts } from './mockAccounts'

export const mockUseSubstrate = {
  useBalances: () => ({
    availableBalance: 4000,
    freeBalance: new BN(3600),
    lockedBalance: 300,
    reservedBalance: new BN(1000),
    accountNonce: 1
  }),
  useAccounts: () => ({
    allAccounts: mockAccounts,
    hasAccounts: true
  }),
  Chains: () => ({
    Kusama: 'kusama',
    Statemine: 'statemine'
  })
}
