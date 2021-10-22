import type { Chains } from '../../consts'

export type ChainInfo = {name: Chains, url?: string}

export interface Config {
  chains: ChainInfo[]
}

export interface ConfigProviderProps {
  config: Config
}
