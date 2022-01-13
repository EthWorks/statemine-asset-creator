import React from 'react'

import { Chains } from '../../consts'
import { useApi, useConfig } from '../../hooks'
import { AccountsContextProvider } from '../accounts'
import { ActiveAccountProvider } from '../activeAccounts'
import { ApiContextProvider } from '../api'
import { Config, ConfigProvider } from '../config'

export interface AppProviderProps {
  config: Config,
  apiChain?: Chains
}

export const AppProvider: React.FC<AppProviderProps> = ({ config, children, apiChain }): JSX.Element => {
  return (
    <ConfigProvider config={config}>
      <AppWithConfig apiChain={apiChain}>{children}</AppWithConfig>
    </ConfigProvider>
  )
}

interface ProviderProps {
  apiChain?: Chains
}

const AppWithConfig: React.FC<ProviderProps> = ({ children, apiChain }) => {
  const { chains } = useConfig()

  return (
    <ApiContextProvider chains={chains}>
      <AccountsProvider apiChain={apiChain}>
        {children}
      </AccountsProvider>
    </ApiContextProvider>
  )
}

const AccountsProvider: React.FC<ProviderProps> = ({ children, apiChain }) => {
  const { chains, appName } = useConfig()
  const { api } = useApi(apiChain ?? chains[0].name)
  const ss58Format = api?.registry.chainSS58

  return (
    <AccountsContextProvider appName={appName} ss58Format={ss58Format}>
      <ActiveAccountProvider api={api}>
        {children}
      </ActiveAccountProvider>
    </AccountsContextProvider>
  )
}
