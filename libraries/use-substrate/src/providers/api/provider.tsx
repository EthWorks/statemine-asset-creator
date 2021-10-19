import { ApiRx, WsProvider } from '@polkadot/api'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

import { ApiContext } from './context'
import { ConnectionState } from './types'
import { DEFAULT_CONFIG } from '../../consts/defaultConfig'

interface Props {
  children: ReactNode,
  chainUrl?: string
}

export const ApiContextProvider = ({ children, chainUrl }: Props): JSX.Element | null => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')

  const api = useMemo(() => {
    const provider = new WsProvider(chainUrl ?? DEFAULT_CONFIG.chainUrl)

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
    return (
      <ApiContext.Provider
        value={{
          isConnected: false,
          api: undefined,
          connectionState,
        }}
      >
        {children}
      </ApiContext.Provider>
    )
  }

  if (connectionState === 'connected') {
    return (
      <ApiContext.Provider
        value={{
          isConnected: true,
          api: api,
          connectionState,
        }}
      >
        {children}
      </ApiContext.Provider>
    )
  }

  if (connectionState === 'disconnected') {
    return (
      <ApiContext.Provider
        value={{
          isConnected: false,
          api: api,
          connectionState,
        }}
      >
        {children}
      </ApiContext.Provider>
    )
  }

  return null
}
