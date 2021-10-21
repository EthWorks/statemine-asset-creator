import { Chains } from './chains'

export type ChainUrl = string

export const LOCAL_NODE_URL: ChainUrl = 'ws://127.0.0.1:9944'
export const KUSAMA_ARCHIVE_NODE_URL: ChainUrl = 'wss://kusama-rpc.polkadot.io/'
export const STATEMINE_ARCHIVE_NODE_URL: ChainUrl = 'wss://kusama-statemine-rpc.paritytech.net'
export const KARURA_ARCHIVE_NODE_URL: ChainUrl = 'wss://karura-rpc-0.aca-api.network'

export const defaultChainUrls: Record<Chains, ChainUrl> = {
  [Chains.Kusama]: KUSAMA_ARCHIVE_NODE_URL,
  [Chains.Statemine]: STATEMINE_ARCHIVE_NODE_URL,
  [Chains.Karura]: KARURA_ARCHIVE_NODE_URL
}
