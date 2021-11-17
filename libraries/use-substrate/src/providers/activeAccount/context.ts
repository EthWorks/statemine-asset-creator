import { createContext } from 'react'

import { UseActiveAccount } from './types'

export const ActiveAccountContext = createContext<UseActiveAccount>({
  activeAccount: undefined,
  setActiveAccount: () => {/**/}
})
