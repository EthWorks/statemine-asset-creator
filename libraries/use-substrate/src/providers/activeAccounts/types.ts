import type { ApiRx } from '@polkadot/api'
import type { AccountId } from '@polkadot/types/interfaces'
import type { Chains } from '../../consts'

export interface UseActiveAccounts {
  activeAccounts: ActiveAccounts,
  setActiveAccounts: (activeAccounts: ActiveAccountsInput) => void
}

export type ActiveAccounts = Partial<Record<Chains, {address: AccountId | undefined}>>
export type ActiveAccountsInput = Partial<Record<Chains, {address: AccountId | string | undefined}>>

export interface ActiveAccountProviderProps {
  api: ApiRx | undefined,
}
