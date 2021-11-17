import type { AccountId } from '@polkadot/types/interfaces'

import { ApiRx } from '@polkadot/api'

export interface UseActiveAccount {
  activeAccount: AccountId | undefined,
  setActiveAccount: (arg: AccountId | string) => void
}

export interface ActiveAccountProviderProps {
  api: ApiRx | undefined,
}
