import type { AccountId } from '@polkadot/types/interfaces'

import { ApiRx } from '@polkadot/api'

import { Chains } from '../../consts'

export interface UseActiveAccounts {
  activeAccounts: ActiveAccounts,
  setActiveAccounts: (chain: Chains, accountId: AccountId | string) => void
}

export type ActiveAccounts = Partial<Record<Chains, AccountId | undefined>>

export interface ActiveAccountProviderProps {
  api: ApiRx | undefined,
}
