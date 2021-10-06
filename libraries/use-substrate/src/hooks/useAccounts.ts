import { UseAccounts } from '../providers/accounts/provider'
import { useContext } from 'react'
import { AccountsContext } from '../providers/accounts/context'

export function useAccounts(): UseAccounts {
  return useContext(AccountsContext)
}
