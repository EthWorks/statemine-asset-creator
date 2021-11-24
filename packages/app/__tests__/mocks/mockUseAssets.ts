import BN from 'bn.js'
import { createType } from 'test-helpers'

import { UseAssets } from 'use-substrate'

import { aliceAccountId, bobAccountId, charlieAccountId } from './mockAccounts'

export const mockUseAssets: UseAssets = [{
  owner: bobAccountId,
  id: createType('AssetId', '9'),
  name: 'Bob\'s Asset',
  decimals: 18,
  supply: new BN('1000000000000000000000'),
  admin: bobAccountId,
  issuer: aliceAccountId,
  freezer: charlieAccountId,
  symbol: 'BOB',
  accounts: new BN('1'),
  approvals: new BN('1'),
  deposit: new BN('1'),
  isFrozen: false,
  isSufficient  : true,
  minBalance: new BN('1'),
  sufficients: new BN('1')
},
{
  owner: bobAccountId,
  id:   createType('AssetId', '11'),
  name: 'Bob\'s Asset 2',
  decimals: 12,
  supply: new BN('876600000000000'),
  admin: bobAccountId,
  issuer: bobAccountId,
  freezer: bobAccountId,
  symbol: 'BOB2',
  accounts: new BN('1'),
  approvals: new BN('1'),
  deposit: new BN('1'),
  isFrozen: false,
  isSufficient  : true,
  minBalance: new BN('1'),
  sufficients: new BN('1')
}]
