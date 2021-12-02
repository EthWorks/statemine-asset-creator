import BN from 'bn.js'
import { createType } from 'test-helpers'

import { Chains } from '../src'
import { isAddressValid } from '../src/util/checks'
import { ALICE, ALICE_ID, BOB, BOB_ID } from './consts/addresses'

describe('isAddressValid returns', () => {
  it('true for a valid address string', async () => {
    expect(isAddressValid(BOB)).toBe(true)
    expect(isAddressValid(ALICE)).toBe(true)
  })

  it('true for a valid AccountId', async () => {
    expect(isAddressValid(BOB_ID)).toBe(true)
    expect(isAddressValid(ALICE_ID)).toBe(true)
  })

  it('false for a not valid address string', async () => {
    expect(isAddressValid(BOB.concat('9'))).toBe(false)
    expect(isAddressValid(ALICE.slice(0, ALICE.length - 2))).toBe(false)
    expect(isAddressValid('0x')).toBe(false)
    expect(isAddressValid(Chains.Kusama)).toBe(false)
  })

  it('false for other polkadot types', async () => {
    expect(isAddressValid(createType('Balance', new BN(10000)))).toBe(false)
    expect(isAddressValid(createType('BlockNumber', new BN(10000)))).toBe(false)
  })
})
