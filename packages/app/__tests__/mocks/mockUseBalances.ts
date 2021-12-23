import BN from 'bn.js'

export const mockUseBalances = {
  availableBalance: new BN(4000000000000000),
  freeBalance: new BN(6000000000000000),
  lockedBalance: 300,
  reservedBalance: new BN(100000000000000),
  accountNonce: 1,
  chainDecimals: 12,
  chainToken: 'KSM'
}
