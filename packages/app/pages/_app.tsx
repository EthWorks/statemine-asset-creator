import '../utils/patchDetectPackage'

import type { AppProps } from 'next/app'
import type { AccountsContextProviderProps, AppProviderProps, Config } from 'use-substrate'

import { IdProvider } from '@radix-ui/react-id'
import dynamic from 'next/dynamic'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { Chains } from 'use-substrate'

import { APPLICATION_NAME } from '../globalConstants'
import GlobalStyle from '../styles/globalStyle'
import { theme } from '../styles/styleVariables'

const AccountsContextProvider = dynamic<AccountsContextProviderProps>(
  () => import('use-substrate').then((module) => module.AccountsContextProvider),
  { ssr: false }
)

const AppProvider = dynamic<AppProviderProps>(
  () => import('use-substrate').then((module) => module.AppProvider),
  { ssr: false }
)

const config: Config = {
  chains: [
    { name: Chains.Kusama },
    { name: Chains.Statemine },
    { name: Chains.Local }
  ]
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <IdProvider>
      <AppProvider config={config}>
        <AccountsContextProvider appName={APPLICATION_NAME}>
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </AccountsContextProvider>
      </AppProvider>
    </IdProvider>
  )
}

export default MyApp
