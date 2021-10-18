import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import React from 'react'
import { APPLICATION_NAME } from '../globalConstants'

interface AccountsContextProviderInterface {
  appName: string
}

const AccountsContextProvider = dynamic<AccountsContextProviderInterface>(() => import('use-substrate').then((module) => module.AccountsContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })
const ApiContextProvider = dynamic(() => import('use-substrate').then((module) => module.ApiContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ApiContextProvider>
      <AccountsContextProvider appName={APPLICATION_NAME}>
        <Component {...pageProps} />
      </AccountsContextProvider>
    </ApiContextProvider>
  )
}

export default MyApp
