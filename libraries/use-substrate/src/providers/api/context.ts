import { createContext } from 'react'
import { UseApi, APIConnecting } from './types'
import { Nodes } from '../../consts'

const apiInitialState: APIConnecting = {
  api: undefined,
  isConnected: false,
  connectionState: 'connecting'
}

export const ApiContext = createContext<Partial<Record<Nodes, UseApi>>>({
  'kusama': apiInitialState,
  'statemine': apiInitialState
})
