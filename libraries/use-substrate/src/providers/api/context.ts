import { createContext } from 'react'
import { UseApi, APIConnecting } from './types'
import { Chains } from '../../consts'

const apiInitialState: APIConnecting = {
  api: undefined,
  isConnected: false,
  connectionState: 'connecting'
}

export const ApiContext = createContext<Partial<Record<Chains, UseApi>>>({
  'kusama': apiInitialState,
  'statemine': apiInitialState
})
