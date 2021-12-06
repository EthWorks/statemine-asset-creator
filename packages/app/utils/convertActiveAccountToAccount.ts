import type { Account, ActiveAccount } from 'use-substrate'

export function convertActiveAccountToAccount(activeAccount: ActiveAccount | undefined): Account | undefined {
  return activeAccount ? { address: activeAccount.address.toString(), name: activeAccount?.name } : undefined
}
