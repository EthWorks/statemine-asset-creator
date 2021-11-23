import { createContext } from 'react'

import { UseActiveAccounts } from './types'

export const ActiveAccountsContext = createContext<UseActiveAccounts>({
  activeAccounts: {},
  setActiveAccounts: () => {/**/}
})
