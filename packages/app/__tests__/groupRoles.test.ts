import { groupRoles } from '../components/CreatedAssets/groupRoles'
import { aliceAccountId, bobAccountId, charlieAccountId } from './mocks'

describe('sortAdmins', () => {
  it('merges accounts with multiple roles', async () => {
    const admins = {
      admin: bobAccountId,
      issuer: bobAccountId,
      freezer: aliceAccountId,
    }

    const result = groupRoles(admins)
    expect(result[0]).toEqual([bobAccountId, ['admin', 'issuer']])
    expect(result[1]).toEqual([aliceAccountId, ['freezer']])
  })

  it('returns unmerged for unique users', async () => {
    const admins = {
      admin: bobAccountId,
      issuer: charlieAccountId,
      freezer: aliceAccountId,
    }

    const result = groupRoles(admins)
    expect(result[0]).toEqual([ bobAccountId, ['admin']])
    expect(result[1]).toEqual([charlieAccountId, ['issuer']])
    expect(result[2]).toEqual([ aliceAccountId, ['freezer']])
  })
})
