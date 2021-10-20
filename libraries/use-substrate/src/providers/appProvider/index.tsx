import { Config, ConfigProvider } from '../config'
import React from 'react'
import { useConfig } from '../../hooks/useConfig'
import { ApiContextProvider } from '../api'

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
  const { chainUrl } = useConfig()

  return (
    <ApiContextProvider chainUrl={chainUrl}>
      {children}
    </ApiContextProvider>
  )
}
