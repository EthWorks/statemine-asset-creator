import type { UseActiveAccounts } from '../providers'

import { useContext } from 'react'

import { ActiveAccountsContext } from '../providers'

export function useActiveAccounts(): UseActiveAccounts {
  return useContext(ActiveAccountsContext)
}
