import type { AccountId } from '@polkadot/types/interfaces'

export interface UseActiveAccount {
  activeAccount: AccountId | undefined,
  setActiveAccount: (arg: AccountId) => void
}
