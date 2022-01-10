import type { Chains } from '../../consts'

export type ChainInfo = {
  name: Chains,
  url?: string,
  ss58Format?: number
}

export interface Config {
  chains: ChainInfo[],
  appName: string
}

export interface ConfigProviderProps {
  config: Config
}
