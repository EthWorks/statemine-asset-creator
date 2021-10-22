import React from 'react'

import { useConfig } from '../../hooks/useConfig'
import { ApiContextProvider } from '../api'
import { Config, ConfigProvider } from '../config'

export interface AppProviderProps {
  config: Config
}

export const AppProvider: React.FC<AppProviderProps> = ({ config, children }): JSX.Element =>  {
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
      {children}
    </ApiContextProvider>
  )
}
