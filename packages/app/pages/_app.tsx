import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import GlobalStyle from '../styles/globalStyle'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/styleVariables'
import React from 'react'
import type { AccountsContextProviderProps, AppProviderProps } from 'use-substrate'
import { APPLICATION_NAME } from '../globalConstants'
import { KUSAMA_ARCHIVE_NODE_URL } from 'use-substrate'

const AccountsContextProvider = dynamic<AccountsContextProviderProps>(
  () => import('use-substrate').then((module) => module.AccountsContextProvider),
  { ssr: false }
)

const AppProvider = dynamic<AppProviderProps>(
  () => import('use-substrate').then((module) => module.AppProvider),
  { ssr: false }
)

const config = {
  chainUrl: KUSAMA_ARCHIVE_NODE_URL
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AppProvider config={config}>
      <AccountsContextProvider appName={APPLICATION_NAME}>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AccountsContextProvider>
    </AppProvider>
  )
}

export default MyApp
