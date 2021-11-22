import BN from 'bn.js'

export const mockUseBalances = {
  availableBalance:  new BN(4000000000000000),
  freeBalance: new BN(6000000000000000),
  lockedBalance: 300,
  reservedBalance: new BN(1000),
  accountNonce: 1
}
