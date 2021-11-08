import { groupRoles } from '../components/CreatedAssets/groupRoles'
import { aliceAccount, bobAccount, charlieAccount } from './mocks'

describe('sortAdmins', () => {
  it('merges accounts with multiple roles', async () => {
    const admins = {
      admin: bobAccount.address,
      issuer: bobAccount.address,
      freezer: aliceAccount.address,
    }

    const result = groupRoles(admins)
    expect(result[0]).toEqual([ bobAccount.address, ['admin', 'issuer']])
    expect(result[1]).toEqual([aliceAccount.address, ['freezer']])
  })

  it('returns unmerged for unique users', async () => {
    const admins = {
      admin: bobAccount.address,
      issuer: charlieAccount.address,
      freezer: aliceAccount.address,
    }

    const result = groupRoles(admins)
    expect(result[0]).toEqual([ bobAccount.address, ['admin']])
    expect(result[1]).toEqual([charlieAccount.address, ['issuer']])
    expect(result[2]).toEqual([ aliceAccount.address, ['freezer']])
  })
})
