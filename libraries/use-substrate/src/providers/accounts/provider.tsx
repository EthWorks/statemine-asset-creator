import type { Keyring } from '@polkadot/ui-keyring'
import React, { ReactNode, useEffect, useState } from 'react'
import { debounceTime } from 'rxjs'
import { useObservable } from '../../hooks'
import { useAsync } from '../../util/useAsync'
import { AccountsContext } from './context'
import { Account, UseAccounts } from './types'

interface Props {
  children: ReactNode
}

export const error = (message?: unknown, ...optionalParams: unknown[]): void => console.error(message, ...optionalParams)

const emptyAccounts: UseAccounts = { hasAccounts: false, allAccounts: [] }

export const AccountsContextProvider = (props: Props): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [extensionUnavailable, setExtensionUnavailable] = useState(false)
  const [keyring, setKeyring] = useState<Keyring | undefined>(undefined)

  useAsync(async () => {
    if (!keyring) {
      const { keyring } = await import('@polkadot/ui-keyring')
      setKeyring(keyring)
    }
  }, [])

  function isKeyringLoaded(): boolean {
    try {
      return !!keyring?.keyring
    } catch {
      return false
    }
  }

  const loadKeysFromExtension = async (): Promise<void> => {
    const { web3Accounts, web3AccountsSubscribe, web3Enable } = await import('@polkadot/extension-dapp')

    await web3Enable('Statemine asset creator')
    const injectedAccounts = await web3Accounts()

    if (!keyring) {
      return
    }

    if (!isKeyringLoaded()) {
      keyring.loadAll({ isDevelopment: false }, injectedAccounts)
    }

    await web3AccountsSubscribe((accounts) => {
      const current = keyring.getAccounts()

      const addresses = accounts.map(({ address }) => address)

      current.forEach(({ address }) => {
        if (!addresses.includes(address)) {
          keyring.forgetAccount(address)
        }
      })

      accounts.forEach((injected) => keyring.addExternal(injected.address, injected.meta))
    })
  }

  const onExtensionLoaded = (onSuccess: () => void, onFail: () => void) => () => {
    const interval = 20
    const timeout = 1000
    let timeElapsed = 0

    const intervalId = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (Object.keys((window as any).injectedWeb3).length) {
        clearInterval(intervalId)
        onSuccess()
      } else {
        timeElapsed += interval
        if (timeElapsed >= timeout) {
          clearInterval(intervalId)
          onFail()
        }
      }
    }, interval)

    return () => clearInterval(intervalId)
  }

  useEffect(
    onExtensionLoaded(
      () => setIsLoaded(true),
      () => setExtensionUnavailable(true)
    ),
    []
  )

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    loadKeysFromExtension().catch(error)
  }, [isLoaded, keyring])

  let value: UseAccounts

  const accounts = useObservable(keyring?.accounts.subject.asObservable().pipe(debounceTime(20)), [keyring])

  if (keyring) {
    const allAccounts: Account[] = []
    if (accounts) {
      allAccounts.push(
        ...Object.values(accounts).map((account) => ({
          address: account.json.address,
          name: account.json.meta.name,
        }))
      )
    }

    const hasAccounts = allAccounts.length !== 0

    value = { allAccounts, hasAccounts }

    if (extensionUnavailable) {
      value.error = 'EXTENSION'
    }
  } else {
    value = emptyAccounts
  }

  return <AccountsContext.Provider value={value}>{props.children}</AccountsContext.Provider>
}
