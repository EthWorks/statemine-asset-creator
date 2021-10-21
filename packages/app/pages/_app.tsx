import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import GlobalStyle from '../styles/globalStyle'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/styleVariables'
import React from 'react'
import type { AccountsContextProviderProps, AppProviderProps, Config } from 'use-substrate'
import { APPLICATION_NAME } from '../globalConstants'
import { IdProvider } from '@radix-ui/react-id'
import { KUSAMA_ARCHIVE_NODE_URL, Nodes } from 'use-substrate'

const AccountsContextProvider = dynamic<AccountsContextProviderProps>(
  () => import('use-substrate').then((module) => module.AccountsContextProvider),
  { ssr: false }
)

const AppProvider = dynamic<AppProviderProps>(
  () => import('use-substrate').then((module) => module.AppProvider),
  { ssr: false }
)

const config: Config = {
  chains: [{ name: Nodes.Kusama, url: KUSAMA_ARCHIVE_NODE_URL }]
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
