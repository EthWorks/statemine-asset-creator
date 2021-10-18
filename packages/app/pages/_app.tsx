import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import GlobalStyle from '../styles/globalStyle'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/styleVariables'
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
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AccountsContextProvider>
    </ApiContextProvider>
  )
}

export default MyApp
