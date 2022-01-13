import type { FC } from 'react'
import type { ActiveAccountProviderProps, ActiveAccounts, ActiveAccountsInput } from './types'

import React, { useEffect, useState } from 'react'

import { useAccounts } from '../../hooks'
import { localStorageExists } from '../../util/checks'
import { ActiveAccountsContext } from './context'
import { convertAddressesToAccountIds, filterAccountsPresentInExtension, writeToLocalStorage } from './utils'

export const ActiveAccountProvider: FC<ActiveAccountProviderProps> = ({ children, api }) => {
  const extensionAccounts = useAccounts()
  const [activeAccounts, setActiveAccounts] = useState<ActiveAccounts>({})

  useEffect(() => {
    if (localStorageExists()) {
      const localStorageAccounts = localStorage.getItem('activeAccounts')
      const parsedAccounts = localStorageAccounts ? JSON.parse(localStorageAccounts) : {}

      if (!api) {
        return
      }

      const accountsPresentInExtension = filterAccountsPresentInExtension(parsedAccounts, extensionAccounts.allAccounts)
      const accountsWithAccountIds = convertAddressesToAccountIds(accountsPresentInExtension, api)
      setActiveAccounts(accountsWithAccountIds)
    }
  }, [api, extensionAccounts.allAccounts.length])

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
    <ActiveAccountsContext.Provider value={{ activeAccounts, setActiveAccounts: _setActiveAccounts }}>
      {children}
    </ActiveAccountsContext.Provider>
  )
}
