import { useContext } from 'react'
import { ApiContext } from '../providers'
import type { UseApi } from '../providers'
import { SupportedChain } from '../types'

export const useApi = (chain: SupportedChain): UseApi => {
  return useContext(ApiContext)[chain]
}
