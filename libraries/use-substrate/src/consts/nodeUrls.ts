import { Nodes } from './nodes'

export const LOCAL_NODE_URL = 'ws://127.0.0.1:9944'
export const KUSAMA_ARCHIVE_NODE_URL = 'wss://kusama-rpc.polkadot.io/'
export const STATEMINE_ARCHIVE_NODE_URL = 'wss://kusama-statemine-rpc.paritytech.net'

export const mappedUrls: Record<Nodes, string> = {
  [Nodes.Kusama]: KUSAMA_ARCHIVE_NODE_URL,
  [Nodes.Statemine]: STATEMINE_ARCHIVE_NODE_URL,
}
