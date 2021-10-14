import React, { ReactNode, useEffect, useState } from 'react'
import { debounceTime } from 'rxjs'
import { useObservable } from '../../hooks'
import { error, useAsync, KeyringWrapper } from '../../util'
import { AccountsContext } from './context'
import { UseAccounts } from './types'
import { checkRepeatedlyIfExtensionLoaded, getInjectedAccounts, mapObservableToAccounts } from './utils'

interface Props {
  children: ReactNode
}

const emptyAccounts: UseAccounts = { hasAccounts: false, allAccounts: [] }

export const AccountsContextProvider = (props: Props): JSX.Element => {
  const [isExtensionLoaded, setIsExtensionLoaded] = useState(false)
  const [extensionUnavailable, setExtensionUnavailable] = useState(false)
  const [keyringWrapper, setKeyringWrapper] = useState<KeyringWrapper | undefined>(undefined)

  useAsync(async () => {
    const { keyring } = await import('@polkadot/ui-keyring')
    setKeyringWrapper(new KeyringWrapper(keyring))
  }, [])

  useEffect(
    checkRepeatedlyIfExtensionLoaded(
      () => setIsExtensionLoaded(true),
      () => setExtensionUnavailable(true)
    ),
    []
  )

  useEffect(() => {
    if (!isExtensionLoaded) {
      return
    }

    const loadKeysFromExtension = async (): Promise<void> => {
      const injectedAccounts = await getInjectedAccounts()

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
    }

    loadKeysFromExtension().catch(error)
  }, [isExtensionLoaded, keyringWrapper, keyringWrapper?.keyring])

  const observableAccounts = useObservable(keyringWrapper?.keyring.accounts.subject.asObservable().pipe(debounceTime(20)), [keyringWrapper, keyringWrapper?.keyring])

  if (!keyringWrapper) {
    return <AccountsContext.Provider value={emptyAccounts}>{props.children}</AccountsContext.Provider>
  }

  const allAccounts = mapObservableToAccounts(observableAccounts)
  const contextValue: UseAccounts = { allAccounts, hasAccounts: allAccounts.length !== 0 }

  if (extensionUnavailable) {
    contextValue.error = 'EXTENSION'
  }

  return <AccountsContext.Provider value={contextValue}>{props.children}</AccountsContext.Provider>
}
