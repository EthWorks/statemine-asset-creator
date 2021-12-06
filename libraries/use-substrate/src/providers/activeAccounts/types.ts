import type { ApiRx } from '@polkadot/api'
import type { AccountId } from '@polkadot/types/interfaces'
import type { Chains } from '../../consts'
import type { ActiveAccount } from '../../hooks'

export interface UseActiveAccounts {
  activeAccounts: ActiveAccounts,
  setActiveAccounts: (activeAccounts: ActiveAccountsInput) => void
}

export type ActiveAccounts = Partial<Record<Chains, ActiveAccount>>
export type ActiveAccountsInput = Partial<Record<Chains, {address: AccountId | string, name?: string}>>

export interface ActiveAccountProviderProps {
  api: ApiRx | undefined,
}
