import React, { FC } from 'react'

import { ActiveAccountContext } from './context'
import { UseActiveAccount } from './types'

export const ActiveAccountProvider: FC = ({ children }) => {

  const value: UseActiveAccount = {
    activeAccount: undefined,
    setActiveAccount: () => {/**/}
  }

  return <ActiveAccountContext.Provider value={value}>{children}</ActiveAccountContext.Provider>
}
