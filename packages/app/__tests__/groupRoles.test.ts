import { groupRoles } from '../components'
import {aliceAccount, bobAccount, charlieAccount} from './mocks'

describe('sortAdmins', () => {
  it('merges accounts with multiple roles', async () => {
    const admins = {
      admin: bobAccount.address,
      issuer: bobAccount.address,
      freezer: aliceAccount.address,
    }

    const result = groupRoles(admins)
    expect(result[0]).toEqual([['admin', 'issuer'], bobAccount.address])
    expect(result[1]).toEqual([['freezer'], aliceAccount.address])
  })

  it('returns unmerged for unique users', async () => {
    const admins = {
      admin: bobAccount.address,
      issuer: charlieAccount.address,
      freezer: aliceAccount.address,
    }

    const result = groupRoles(admins)
    expect(result[0]).toEqual([['admin'], bobAccount.address])
    expect(result[0]).toEqual([['issuer'], charlieAccount.address])
    expect(result[1]).toEqual([['freezer'], aliceAccount.address])
  })
})
