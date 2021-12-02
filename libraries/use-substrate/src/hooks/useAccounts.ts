import type { UseAccounts } from '../providers'

import { useContext } from 'react'

import { AccountsContext } from '../providers'

export function useAccounts(): UseAccounts {
  return useContext(AccountsContext)
}
