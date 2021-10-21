import { ApiRx } from '@polkadot/api'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected'

interface BaseAPI {
  api?: ApiRx
  isConnected: boolean
  connectionState: ConnectionState
}

export interface APIConnecting extends BaseAPI {
  api: undefined
  isConnected: false
  connectionState: 'connecting'
}

interface APIConnected extends BaseAPI {
  api: ApiRx
  isConnected: true
  connectionState: 'connected'
}

interface APIDisconnected extends BaseAPI {
  api: ApiRx
  isConnected: false
  connectionState: 'disconnected'
}

export type UseApi = APIConnecting | APIConnected | APIDisconnected
