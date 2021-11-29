import type { AccountId } from '@polkadot/types/interfaces'

import { Chains } from '../consts'
import { useActiveAccounts } from './useActiveAccounts'

interface ActiveAccount {
  activeAccount: AccountId | undefined,
  setActiveAccount: (account: AccountId) => void
}

export function useActiveAccount(chain: Chains): ActiveAccount {
  const { activeAccounts, setActiveAccounts } = useActiveAccounts()
  const activeAccount = activeAccounts[chain]
  const setActiveAccount = (accountId: AccountId): void => setActiveAccounts({ [chain]: accountId })

  return { activeAccount, setActiveAccount }
}
