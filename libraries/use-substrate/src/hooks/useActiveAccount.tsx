import type { AccountId } from '@polkadot/types/interfaces'

import { Chains } from '../consts'
import { useActiveAccounts } from './useActiveAccounts'

interface ActiveAccount {
  activeAccount: {address: AccountId | undefined } | undefined,
  setActiveAccount: (account: {address: AccountId }) => void
}

export function useActiveAccount(chain: Chains): ActiveAccount {
  const { activeAccounts, setActiveAccounts } = useActiveAccounts()
  const activeAccount = activeAccounts[chain]
  const setActiveAccount = (account: {address: AccountId }): void => setActiveAccounts({ [chain]: account })

  return { activeAccount, setActiveAccount }
}
