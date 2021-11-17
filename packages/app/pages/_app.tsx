import '../utils/patchDetectPackage'

import type { AppProps } from 'next/app'
import type { AppProviderProps, Config } from 'use-substrate'

import { IdProvider } from '@radix-ui/react-id'
import dynamic from 'next/dynamic'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { Chains } from 'use-substrate'

import { envConfig } from '../config/envConfig'
import { APPLICATION_NAME } from '../globalConstants'
import GlobalStyle from '../styles/globalStyle'
import { theme } from '../styles/styleVariables'

const AppProvider = dynamic<AppProviderProps>(
  () => import('use-substrate').then((module) => module.AppProvider),
  { ssr: false }
)

const config: Config = {
  chains: [
    { name: Chains.Kusama, url: envConfig.kusamaUrl },
    { name: Chains.Statemine, url: envConfig.statemineUrl },
  ],
  appName: APPLICATION_NAME
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <IdProvider>
      <AppProvider config={config}>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AppProvider>
    </IdProvider>
  )
}

export default MyApp
