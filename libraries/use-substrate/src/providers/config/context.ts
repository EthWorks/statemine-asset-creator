import { createContext } from 'react'
import { DEFAULT_CONFIG } from '../../consts/defaultConfig'

export interface Config {
  chainUrl: string
}

export const ConfigContext = createContext<{ config: Config }>({
  config: DEFAULT_CONFIG,
})
