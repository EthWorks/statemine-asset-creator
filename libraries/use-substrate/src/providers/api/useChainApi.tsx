import { useEffect, useMemo, useState } from 'react'
import { ConnectionState, UseApi } from './types'
import { ApiRx, WsProvider } from '@polkadot/api'

interface Props {
  chainUrl: string;
}

export const useChainApi = ({ chainUrl }: Props): UseApi => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')

  const api = useMemo(() => {
    const provider = new WsProvider(chainUrl)

    return new ApiRx({ provider })
  }, [])

  useEffect(() => {
    api.isReady.subscribe(() => {
      setConnectionState('connected')

      api.on('connected', () => setConnectionState('connected'))
      api.on('disconnected', () => setConnectionState('disconnected'))
    })
  }, [api])

  if (connectionState === 'connecting') {
    return { connectionState, isConnected: false, api: undefined }
  }

  if (connectionState === 'connected') {
    return { connectionState, isConnected: true, api }
  }

  return { connectionState, isConnected: false, api }
}
