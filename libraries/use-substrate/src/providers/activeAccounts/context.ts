import type { UseActiveAccounts } from './types'

import { createContext } from 'react'

export const ActiveAccountsContext = createContext<UseActiveAccounts>({
  activeAccounts: {},
  setActiveAccounts: () => { /**/ }
})
