import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import React from 'react'
import type { AccountsContextProviderProps } from 'use-substrate'
import { APPLICATION_NAME } from '../globalConstants'

const AccountsContextProvider = dynamic<AccountsContextProviderProps>(
  () => import('use-substrate').then((module) => module.AccountsContextProvider),
  { ssr: false }
)

const ApiContextProvider = dynamic<JSX.ElementChildrenAttribute>(
  () => import('use-substrate').then((module) => module.ApiContextProvider),
  { ssr: false }
)

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
