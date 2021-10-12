import { createContext } from 'react'
import { UseAccounts } from './types'

export const AccountsContext = createContext<UseAccounts>({
  hasAccounts: false,
  allAccounts: [],
})
