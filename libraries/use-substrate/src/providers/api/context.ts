import { createContext } from 'react'
import { UseApi, APIConnecting } from './types'
import { SupportedChain } from '../../types'

const apiInitialState: APIConnecting = {
  api: undefined,
  isConnected: false,
  connectionState: 'connecting'
}

export const ApiContext = createContext<Record<SupportedChain, UseApi>>({
  'kusama': apiInitialState,
  'statemine': apiInitialState
})
