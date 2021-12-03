import type { ApiRx } from '@polkadot/api'
import type { AccountId } from '@polkadot/types/interfaces'
import type { Chains } from '../../consts'

export interface UseActiveAccounts {
  activeAccounts: ActiveAccounts,
  setActiveAccounts: (activeAccounts: ActiveAccountsInput) => void
}

export type ActiveAccounts = Partial<Record<Chains, AccountId | undefined>>
export type ActiveAccountsInput = Partial<Record<Chains, AccountId | string | undefined>>

export interface ActiveAccountProviderProps {
  api: ApiRx | undefined,
}
