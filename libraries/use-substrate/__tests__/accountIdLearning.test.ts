import { createType, kusamaCreateType } from 'test-helpers'

import { ALICE, BOB } from './consts'

describe('learning tests for AccountId equality', () => {
  it('equals supports both AccountId and string', () => {
    const alice = createType('AccountId', ALICE)
    expect(alice.eq(ALICE)).toBe(true)
    expect(alice.eq(createType('AccountId', ALICE))).toBe(true)
    expect(alice.eq(BOB)).toBe(false)
    expect(alice.eq(createType('AccountId', BOB))).toBe(false)
  })
})

describe('accountId create type and ss58Format', () => {
  it('creates type for different ss58Formats', async () => {
    const substrateAccountId = createType('AccountId', BOB)
    expect(substrateAccountId.toString()).toEqual(BOB)

    const kusamaAccountId = kusamaCreateType('AccountId', BOB)
    expect(kusamaAccountId.toString()).not.toEqual(BOB)
    expect(kusamaAccountId.toString()).toEqual('FoQJpPyadYccjavVdTWxpxU7rUEaYhfLCPwXgkfD6Zat9QP')
  })
})
