import type { FC } from 'react'
import type { AccountId } from '@polkadot/types/interfaces'
import type { ActiveAccountProviderProps, ActiveAccounts } from './types'

import React, { useEffect, useState } from 'react'

import { Chains } from '../../consts'
import { isString, localStorageExists } from '../../util/checks'
import { ActiveAccountsContext } from './context'

export const ActiveAccountProvider: FC<ActiveAccountProviderProps> = ({ children, api }) => {
  const [activeAccounts, setActiveAccounts] = useState<ActiveAccounts>({})

  useEffect(() => {
    if (localStorageExists()) {
      const initValue = localStorage.getItem('activeAccounts')
      const parsed = initValue ? JSON.parse(initValue) : undefined
      
      if(!parsed || !api) {
        setActiveAccounts({})

        return
      }
      
      Object.entries(parsed).map(([chain, accountId]) => {
        if (isString(accountId)) {
          parsed[chain] = api.createType('AccountId', accountId)
        }
      })

      setActiveAccounts(parsed)
    }
  }, [api])

  const _setActiveAccounts = (chain: Chains, accountId: AccountId | string): void => {
    if (localStorageExists()) {
      const accounts = { ...activeAccounts, [chain]: accountId }
      localStorage.setItem('activeAccounts', JSON.stringify(accounts))
    }
    
    setActiveAccounts({
      ...activeAccounts,
      [chain]: isString(accountId) ? api?.createType('AccountId', accountId) : accountId
    })
  }

  return (
    <ActiveAccountsContext.Provider value={{ activeAccounts, setActiveAccounts: _setActiveAccounts }}>
      {children}
    </ActiveAccountsContext.Provider>
  )
}
