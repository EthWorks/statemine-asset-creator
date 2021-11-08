import BN from 'bn.js'

import { aliceAccount, bobAccount, charlieAccount } from './mockAccounts'

export const mockUseAssets = [{
  owner: bobAccount.address,
  id: new BN('9'),
  name: 'Bob\'s Asset',
  decimals: '18',
  supply: '100000',
  admin: bobAccount.address,
  issuer: aliceAccount.address,
  freezer: charlieAccount.address,
  symbol: 'BOB',
},
{
  owner: bobAccount.address,
  id: new BN('11'),
  name: 'Bob\'s Asset 2',
  decimals: '12',
  supply: '8766',
  admin: bobAccount.address,
  issuer: bobAccount.address,
  freezer: bobAccount.address,
  symbol: 'BOB2',
}]
