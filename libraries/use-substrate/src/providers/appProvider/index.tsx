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
      <AppWithConfig activeChain={apiChain}>{children}</AppWithConfig>
    </ConfigProvider>
  )
}

interface Props {
  activeChain?: Chains
}

const AppWithConfig: React.FC<Props> = ({ children, activeChain }) => {
  const { chains } = useConfig()

  return (
    <ApiContextProvider chains={chains}>
      <AccountsProvider activeChain={activeChain}>
        {children}
      </AccountsProvider>
    </ApiContextProvider>
  )
}

const AccountsProvider: React.FC<Props> = ({ children, activeChain }) => {
  const { chains, appName } = useConfig()
  const { api } = useApi(activeChain ?? chains[0].name)
  const ss58Format = api?.registry.chainSS58

  return (
    <AccountsContextProvider appName={appName} ss58Format={ss58Format}>
      <ActiveAccountProvider api={api}>
        {children}
      </ActiveAccountProvider>
    </AccountsContextProvider>
  )
}
