import type { FC } from 'react'
import type { AccountId } from '@polkadot/types/interfaces'
import type { ActiveAccountProviderProps } from './types'

import React, { useEffect, useState } from 'react'

import { isString, localStorageExists } from '../../util/checks'
import { ActiveAccountContext } from './context'

export const ActiveAccountProvider: FC<ActiveAccountProviderProps> = ({ children, api }) => {
  const [activeAccount, setActiveAccount] = useState<AccountId>()

  useEffect(() => {
    if (localStorageExists()) {
      const initValue = localStorage.getItem('activeAccount')
      setActiveAccount(initValue ? api?.createType('AccountId', initValue) : undefined)
    }
  }, [api])

  const _setActiveAccount = (accountId: AccountId | string): void => {
    if (localStorageExists()) {
      localStorage.setItem('activeAccount', isString(accountId) ? accountId : accountId.toHuman())
    }
    setActiveAccount(isString(accountId) ? api?.createType('AccountId', accountId) : accountId)
  }

  return (
    <ActiveAccountContext.Provider value={{ activeAccount, setActiveAccount: _setActiveAccount }}>
      {children}
    </ActiveAccountContext.Provider>
  )
}
