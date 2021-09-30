import { createContext } from 'react'
import { UseApi } from "./types"

export const ApiContext = createContext<UseApi>({
  isConnected: false,
  api: undefined,
  connectionState: 'connecting',
})
