import { createType } from 'test-helpers'

import { ALICE, BOB } from './consts/addresses'

describe('learning tests for AccountId equality', () => {
  it('equals supports both AccountId and string', () => {
    const alice = createType('AccountId', ALICE)
    expect(alice.eq(ALICE)).toBe(true)
    expect(alice.eq(createType('AccountId', ALICE))).toBe(true)
    expect(alice.eq(BOB)).toBe(false)
    expect(alice.eq(createType('AccountId', BOB))).toBe(false)
  })
})
