import { useContext } from 'react'
import { AccountsContext } from '../providers/accounts'
import { UseAccounts } from '../providers/accounts/provider'

export function useAccounts(): UseAccounts {
  return useContext(AccountsContext)
}
