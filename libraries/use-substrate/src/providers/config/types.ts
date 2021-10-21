import type { Nodes } from '../../consts'

export type ChainInfo = {name: Nodes, url?: string}

export interface Config {
  chains: ChainInfo[]
}

export interface ConfigProviderProps {
  config: Config
}
