import { Role } from './types'

export function groupRoles(admins: Record<Role, string>): [string, Role[]][] {
  const rolesByAccount: Record<string, Role[]> = {}

  ;(Object.entries(admins) as [Role, string][]).forEach(([role,account]) => {
    rolesByAccount[account] = [...(rolesByAccount[account] ?? []), role]
  })

  return Object.entries(rolesByAccount)
}
