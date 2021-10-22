import { useContext } from 'react'

import { AccountsContext, UseAccounts } from '../providers'

export function useAccounts(): UseAccounts {
  return useContext(AccountsContext)
}
