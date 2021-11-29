import React from 'react'

import { useApi, useConfig } from '../../hooks'
import { AccountsContextProvider } from '../accounts'
import { ActiveAccountProvider } from '../activeAccounts'
import { ApiContextProvider } from '../api'
import { Config, ConfigProvider } from '../config'

export interface AppProviderProps {
  config: Config
}

export const AppProvider: React.FC<AppProviderProps> = ({ config, children }): JSX.Element => {
  return (
    <ConfigProvider config={config}>
      <AppWithConfig>{children}</AppWithConfig>
    </ConfigProvider>
  )
}

const AppWithConfig: React.FC = ({ children }) => {
  const { chains } = useConfig()

  return (
    <ApiContextProvider chains={chains}>
      <AccountsProvider>
        {children}
      </AccountsProvider>
    </ApiContextProvider>
  )
}

const AccountsProvider: React.FC = ({ children }) => {
  const { chains, appName } = useConfig()
  const { api } = useApi(chains[0].name)

  return (
    <AccountsContextProvider appName={appName}>
      <ActiveAccountProvider api={api}>
        {children}
      </ActiveAccountProvider>
    </AccountsContextProvider>
  )
}
