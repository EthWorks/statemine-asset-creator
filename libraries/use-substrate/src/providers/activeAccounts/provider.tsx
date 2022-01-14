import type { FC } from 'react'
import type { ActiveAccountProviderProps, ActiveAccounts, ActiveAccountsInput } from './types'

import React, { useEffect, useState } from 'react'

import { useAccounts } from '../../hooks'
import { localStorageExists } from '../../util/checks'
import { ActiveAccountsContext } from './context'
import { convertAddressesToAccountIds, filterAccountsPresentInExtension, writeToLocalStorage } from './utils'

export const ActiveAccountProvider: FC<ActiveAccountProviderProps> = ({ children, api }) => {
  const { allAccounts, extensionStatus } = useAccounts()
  const [activeAccounts, setActiveAccounts] = useState<ActiveAccounts>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (extensionStatus !== 'Loaded' || !api) return

    if (localStorageExists()) {
      const localStorageAccounts = localStorage.getItem('activeAccounts')
      const parsedAccounts = localStorageAccounts ? JSON.parse(localStorageAccounts) : {}

      const accountsPresentInExtension = filterAccountsPresentInExtension(parsedAccounts, allAccounts)
      const accountsWithAccountIds = convertAddressesToAccountIds(accountsPresentInExtension, api)
      setActiveAccounts(accountsWithAccountIds)
    }

    setIsLoaded(true)
  }, [api, allAccounts.length])

  const _setActiveAccounts = (newActiveAccounts: ActiveAccountsInput): void => {
    if (localStorageExists()) {
      const updatedActiveAccounts = { ...activeAccounts, ...newActiveAccounts }
      writeToLocalStorage(updatedActiveAccounts)
    }

    const accountsWithAccountIds = convertAddressesToAccountIds(newActiveAccounts, api)

    setActiveAccounts({
      ...activeAccounts,
      ...accountsWithAccountIds
    })
  }

  return (
    <ActiveAccountsContext.Provider value={{ activeAccounts, setActiveAccounts: _setActiveAccounts, isLoaded }}>
      {children}
    </ActiveAccountsContext.Provider>
  )
}
