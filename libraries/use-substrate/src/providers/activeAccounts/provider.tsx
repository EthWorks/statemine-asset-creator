import type { FC } from 'react'
import type { ActiveAccountProviderProps, ActiveAccounts, ActiveAccountsInput } from './types'

import React, { useEffect, useState } from 'react'

import { localStorageExists } from '../../util/checks'
import { ActiveAccountsContext } from './context'
import { convertAddressesToAccountIds } from './utils'

export const ActiveAccountProvider: FC<ActiveAccountProviderProps> = ({ children, api }) => {
  const [activeAccounts, setActiveAccounts] = useState<ActiveAccounts>({})

  useEffect(() => {
    if (localStorageExists()) {
      const accountsInLocalStorage = localStorage.getItem('activeAccounts')
      const initialAccounts = accountsInLocalStorage ? JSON.parse(accountsInLocalStorage) : {}
      
      if(!api) {
        return
      }

      const convertedAccounts = convertAddressesToAccountIds(initialAccounts, api)
      setActiveAccounts(convertedAccounts)
    }
  }, [api])

  const _setActiveAccounts = (newActiveAccounts: ActiveAccountsInput): void => {
    if (localStorageExists()) {
      const accounts = { ...activeAccounts, ...newActiveAccounts }
      localStorage.setItem('activeAccounts', JSON.stringify(accounts))
    }
    
    const convertedAccounts = convertAddressesToAccountIds(newActiveAccounts, api)

    setActiveAccounts({
      ...activeAccounts,
      ...convertedAccounts
    })
  }

  return (
    <ActiveAccountsContext.Provider value={{ activeAccounts, setActiveAccounts: _setActiveAccounts }}>
      {children}
    </ActiveAccountsContext.Provider>
  )
}
