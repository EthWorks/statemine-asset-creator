import { Chains } from './chains'

export type ChainUrl = string

export const LOCAL_NODE_URL: ChainUrl = 'ws://127.0.0.1:9944'
export const KUSAMA_ARCHIVE_NODE_URL: ChainUrl = 'wss://kusama-rpc.polkadot.io/'
export const STATEMINE_ARCHIVE_NODE_URL: ChainUrl = 'wss://statemine-rpc.polkadot.io'
export const KARURA_ARCHIVE_NODE_URL: ChainUrl = 'wss://karura-rpc-0.aca-api.network'
export const POLKADOT_ARCHIVE_NODA_URL: ChainUrl = 'wss://rpc.polkadot.io'
export const STATEMINT_ARCHIVE_NODE_URL: ChainUrl = 'wss://statemint-rpc.polkadot.io'
export const WESTEND_ARCHIVE_NODE_URL: ChainUrl = 'wss://westend-rpc.polkadot.io'
export const WESTMINT_ARCHIVE_NODE_URL: ChainUrl = 'wss://westmint-rpc.polkadot.io'

export const defaultChainUrls: Record<Chains, ChainUrl> = {
  [Chains.Kusama]: KUSAMA_ARCHIVE_NODE_URL,
  [Chains.Statemine]: STATEMINE_ARCHIVE_NODE_URL,
  [Chains.Karura]: KARURA_ARCHIVE_NODE_URL,
  [Chains.Local]: LOCAL_NODE_URL,
  [Chains.Polkadot]: POLKADOT_ARCHIVE_NODA_URL,
  [Chains.Statemint]: STATEMINT_ARCHIVE_NODE_URL,
  [Chains.Westend]: WESTEND_ARCHIVE_NODE_URL,
  [Chains.Westmint]: WESTMINT_ARCHIVE_NODE_URL
}
