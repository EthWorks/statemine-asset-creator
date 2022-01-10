import type { ConnectionState, UseApi } from './types'

import { ApiRx, WsProvider } from '@polkadot/api'
import { TypeRegistry } from '@polkadot/types'
import { useEffect, useMemo, useState } from 'react'

interface Options {
  ss58Format?: number
}

export const useChainApi = (chainUrl: string, options?: Options): UseApi => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [registry] = useState<TypeRegistry>(new TypeRegistry())
  const api = useMemo(() => {
    const provider = new WsProvider(chainUrl)

    return new ApiRx({ provider, registry })
  }, [])

  useEffect(() => {
    api.on('error', () => setConnectionState('error'))
    const apiInstance = api.isReady.subscribe(() => {
      setConnectionState('connected')
      if (options?.ss58Format !== undefined) {
        const ss58Format = options.ss58Format ? registry.createType('u32', options.ss58Format) : api.registry.chainSS58
        registry.setChainProperties(registry.createType('ChainProperties', { ss58Format }))
      }
    })
    api.on('disconnected', () => setConnectionState('disconnected'))

    return () => apiInstance.unsubscribe()
  }, [api, registry, options?.ss58Format])

  if (connectionState === 'connecting' || connectionState === 'error') {
    return { connectionState, isConnected: false, api: undefined }
  }

  if (connectionState === 'connected') {
    return { connectionState, isConnected: true, api }
  }

  return { connectionState, isConnected: false, api }
}
