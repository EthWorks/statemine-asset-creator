import { Config, ConfigProvider } from '../config'
import React, { ReactNode } from 'react'
import { useConfig } from '../../hooks/useConfig'
import { ApiContextProvider } from '../api'

export interface AppProviderProps {
  children: ReactNode
  config: Config
}

export function AppProvider({ config, children }: AppProviderProps): JSX.Element {
  return (
    <ConfigProvider config={config}>
      <DAppProviderWithConfig>{children}</DAppProviderWithConfig>
    </ConfigProvider>
  )
}

interface WithConfigProps {
  children: ReactNode
}

function DAppProviderWithConfig({ children }: WithConfigProps): JSX.Element {
  const { chainUrl } = useConfig()

  return (
    <ApiContextProvider chainUrl={chainUrl}>
      {children}
    </ApiContextProvider>
  )
}
