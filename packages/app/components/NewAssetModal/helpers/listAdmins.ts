export function listAdmins(admins: string[]): string {
  return admins.length > 1
    ? admins.slice(0, -1).join(', ') + ' and ' + admins.slice(-1)
    : admins[0]
}
