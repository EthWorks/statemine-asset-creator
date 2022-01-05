import type { AccountId } from '@polkadot/types/interfaces'

import { Chains } from '../consts'
import { useActiveAccounts } from './useActiveAccounts'

export type ActiveAccount = { address: AccountId, name?: string };

export interface UseActiveAccount {
  activeAccount: ActiveAccount | undefined,
  setActiveAccount: (account: ActiveAccount) => void
}

export function useActiveAccount(chain: Chains): UseActiveAccount {
  const { activeAccounts, setActiveAccounts } = useActiveAccounts()
  const activeAccount = activeAccounts[chain]
  const setActiveAccount = (account: ActiveAccount): void => setActiveAccounts({ [chain]: account })

  return { activeAccount, setActiveAccount }
}
