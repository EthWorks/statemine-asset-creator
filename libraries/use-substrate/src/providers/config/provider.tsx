import React, { ReactNode } from 'react'
import { Config, ConfigContext } from './context'

export interface ConfigProviderProps {
  children: ReactNode
  config: Config
}

export function ConfigProvider({ config, children }: ConfigProviderProps): JSX.Element {

  return <ConfigContext.Provider value={{ config }} children={children}/>
}
