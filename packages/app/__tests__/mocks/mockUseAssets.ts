import BN from 'bn.js'

import { aliceAccountId, bobAccountId, charlieAccountId } from './mockAccounts'

export const mockUseAssets = [{
  owner: bobAccountId,
  id: new BN('9'),
  name: 'Bob\'s Asset',
  decimals: '18',
  supply: '100000',
  admin: bobAccountId,
  issuer: aliceAccountId,
  freezer: charlieAccountId,
  symbol: 'BOB',
},
{
  owner: bobAccountId,
  id: new BN('11'),
  name: 'Bob\'s Asset 2',
  decimals: '12',
  supply: '8766',
  admin: bobAccountId,
  issuer: bobAccountId,
  freezer: bobAccountId,
  symbol: 'BOB2',
}]
