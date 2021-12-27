import { ApiRx } from '@polkadot/api'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

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

export interface APIConnected extends BaseAPI {
  api: ApiRx
  isConnected: true
  connectionState: 'connected'
}

interface APIDisconnected extends BaseAPI {
  api: ApiRx
  isConnected: false
  connectionState: 'disconnected'
}

interface APIErrored extends BaseAPI {
  api: undefined
  isConnected: false
  connectionState: 'error'
}

export type UseApi = APIConnecting | APIConnected | APIDisconnected | APIErrored
