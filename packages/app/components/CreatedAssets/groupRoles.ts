import type { AccountId } from '@polkadot/types/interfaces'
import type { Role } from './types'

export function groupRoles(admins: Record<Role, AccountId>): [AccountId, Role[]][] {
  const result: [AccountId, Role[]][] = []

  ;(Object.entries(admins) as [Role, AccountId][]).forEach(([role,account]) => {
    const index = result.findIndex(([accountId]) => accountId.eq(account))

    if (index === -1) {
      result.push([account, [role]])
    } else {
      result[index][1].push(role)
    }
  })

  return result
}
