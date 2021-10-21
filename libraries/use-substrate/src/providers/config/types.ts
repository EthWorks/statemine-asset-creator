import { SupportedChain } from '../../types'

export interface Config {
  chains: {chain: SupportedChain, url?: string}[]
}

export interface ConfigProviderProps {
  config: Config
}
