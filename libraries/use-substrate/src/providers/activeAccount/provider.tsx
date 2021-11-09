import { AccountId } from '@polkadot/types/interfaces'
import React, { FC, useState } from 'react'

import { ActiveAccountContext } from './context'
import { UseActiveAccount } from './types'

export const ActiveAccountProvider: FC = ({ children }) => {
  const [activeAccount, setActiveAccount] = useState<AccountId>()

  const value: UseActiveAccount = {
    activeAccount: activeAccount,
    setActiveAccount: setActiveAccount
  }

  return <ActiveAccountContext.Provider value={value}>{children}</ActiveAccountContext.Provider>
}
