import React, { ReactNode, useEffect, useState } from 'react'
import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import { debounceTime } from 'rxjs'
import { useObservable } from '../../hooks'
import { keyring } from '@polkadot/ui-keyring'
import { AccountsContext } from './context'

interface Props {
  children: ReactNode
}

type Error = 'EXTENSION'

export const error = (message?: any, ...optionalParams: any[]) => console.error(message, ...optionalParams)
export type Address = string
export interface Account {
  name: string | undefined
  address: Address
}
export interface UseAccounts {
  allAccounts: Account[]
  hasAccounts: boolean
  error?: Error
}

function isKeyringLoaded() {
  try {
    return !!keyring
  } catch {
    return false
  }
}

const loadKeysFromExtension = async () => {
  await web3Enable('Pioneer')
  const injectedAccounts = await web3Accounts()

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

export const AccountsContextProvider = (props: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [extensionUnavailable, setExtensionUnavailable] = useState(false)

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
  }, [isLoaded])

  const accounts = useObservable(keyring.accounts.subject.asObservable().pipe(debounceTime(20)), [keyring])

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

  const value: UseAccounts = { allAccounts, hasAccounts }

  if (extensionUnavailable) {
    value.error = 'EXTENSION'
  }

  return <AccountsContext.Provider value={value}>{props.children}</AccountsContext.Provider>
}

