import { ReactNode } from 'react'

export interface Config {
  chainUrl: string
}

export interface ConfigProviderProps {
  children: ReactNode
  config: Config
}
