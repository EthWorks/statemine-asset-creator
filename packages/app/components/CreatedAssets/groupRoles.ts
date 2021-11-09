import type { AccountId } from '@polkadot/types/interfaces'
import type { Role } from './types'

export function groupRoles(admins: Record<Role, AccountId>): [AccountId, Role[]][] {
  const groupedRoles: [AccountId, Role[]][] = []

  ;(Object.entries(admins) as [Role, AccountId][]).forEach(([role,account]) => {
    const accountIndex = findAccountsIndex(groupedRoles, account)

    if (rolesNotFound(accountIndex)) {
      initiateAccountsRoles(groupedRoles, account, role)
    } else {
      addRoleToGroup(groupedRoles, accountIndex, role)
    }
  })

  return groupedRoles
}

function findAccountsIndex(rolesGroupedByAccounts: [AccountId, Role[]][], account: AccountId): number {
  return rolesGroupedByAccounts.findIndex(([accountId]) => accountId.eq(account))
}

function rolesNotFound(accountIndex: number): boolean {
  return accountIndex === -1
}

function initiateAccountsRoles(groupedRoles: [AccountId, Role[]][], account: AccountId, role: Role): void {
  groupedRoles.push([account, [role]])
}

function addRoleToGroup(rolesGroupedByAccounts: [AccountId, Role[]][], groupIndex: number, role: Role): void {
  rolesGroupedByAccounts[groupIndex][1].push(role)
}
