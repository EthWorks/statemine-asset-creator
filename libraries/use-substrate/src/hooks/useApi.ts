import { useContext } from 'react'
import { ApiContext } from '../providers'
import type { UseApi } from '../providers'
import { Nodes } from '../consts'

export const useApi = (chain: Nodes): UseApi => {
  const chainApi = useContext(ApiContext)[chain]

  if (!chainApi) {
    throw new Error(`${chain} is not configured`)
  }

  return chainApi
}
