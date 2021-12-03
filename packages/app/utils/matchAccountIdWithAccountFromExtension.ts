import type { AccountId } from '@polkadot/types/interfaces'
import type { Account } from 'use-substrate'

export function matchAccountIdWithAccountFromExtension(accountId: AccountId | undefined, extensionAccounts: Account[]): Account | undefined {
  return extensionAccounts.find((account) => account.address === accountId?.toString())
}
