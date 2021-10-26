import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { debounceTime } from 'rxjs'

import { useObservable } from '../../hooks'
import { KeyringWrapper, useAsync } from '../../util'
import { AccountsContext } from './context'
import { ExtensionStatus, UseAccounts } from './types'
import { checkRepeatedlyIfExtensionLoaded, getInjectedAccounts, mapObservableToAccounts } from './utils'

export interface AccountsContextProviderProps {
  appName: string,
  children: ReactNode
}

const emptyAccounts: UseAccounts = { hasAccounts: false, allAccounts: [], web3Enable: async () => {/**/}, extensionStatus: 'Loading' }

export const AccountsContextProvider = ({ appName, children }: AccountsContextProviderProps): JSX.Element => {
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>('Loading')
  const [keyringWrapper, setKeyringWrapper] = useState<KeyringWrapper | undefined>(undefined)

  useAsync(async () => {
    const { keyring } = await import('@polkadot/ui-keyring')
    setKeyringWrapper(new KeyringWrapper(keyring))
  }, [])

  useEffect(
    checkRepeatedlyIfExtensionLoaded(
      () => setExtensionStatus('Available'),
      () => setExtensionStatus('Unavailable')
    ),
    []
  )

  const web3Enable: () => Promise<void> = useCallback(async () => {
    if (extensionStatus !== 'Available') {
      return
    }

    const injectedAccounts = await getInjectedAccounts(appName)

    if (!keyringWrapper) {
      return
    }

    if (!keyringWrapper.isLoaded()) {
      keyringWrapper.loadAccounts(injectedAccounts)
    }

    const { web3AccountsSubscribe } = await import('@polkadot/extension-dapp')

    await web3AccountsSubscribe((accountsFromAllExtensions) => {
      keyringWrapper.forgetAccountsRemovedFromExtension(accountsFromAllExtensions)
      keyringWrapper.injectAccountsAddedToExtension(accountsFromAllExtensions)
    })
  }, [extensionStatus, keyringWrapper])

  const observableAccounts = useObservable(keyringWrapper?.keyring.accounts.subject.asObservable().pipe(debounceTime(20)), [keyringWrapper, keyringWrapper?.keyring])

  if (!keyringWrapper) {
    return <AccountsContext.Provider value={emptyAccounts}>{children}</AccountsContext.Provider>
  }

  const allAccounts = mapObservableToAccounts(observableAccounts)
  const contextValue: UseAccounts = { allAccounts, hasAccounts: allAccounts.length !== 0, web3Enable, extensionStatus }

  if (extensionStatus === 'Unavailable') {
    contextValue.error = 'EXTENSION'
  }

  return <AccountsContext.Provider value={contextValue}>{children}</AccountsContext.Provider>
}
