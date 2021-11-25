import type { FC } from 'react'
import type { AccountId } from '@polkadot/types/interfaces'
import type { ActiveAccountProviderProps, ActiveAccounts, ActiveAccountsInput } from './types'

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

  const _setActiveAccounts = (newActiveAccounts: ActiveAccountsInput): void => {
    if (localStorageExists()) {
      const accounts = { ...activeAccounts, ...newActiveAccounts }
      localStorage.setItem('activeAccounts', JSON.stringify(accounts))
    }
    
    const mappedNewActiveAccounts: ActiveAccounts = {}

    ;(Object.entries(newActiveAccounts) as [Chains, string | AccountId][]).map(([chain, accountId] : [Chains, string | AccountId]) => {
      mappedNewActiveAccounts[chain] = isString(accountId) ? api?.createType('AccountId', accountId) : accountId
    })

    setActiveAccounts({
      ...activeAccounts,
      ...mappedNewActiveAccounts
    })
  }

  return (
    <ActiveAccountsContext.Provider value={{ activeAccounts, setActiveAccounts: _setActiveAccounts }}>
      {children}
    </ActiveAccountsContext.Provider>
  )
}
