import { useContext } from 'react'
import { ApiContext } from '../providers'
import type { UseApi } from '../providers'
import { Chains } from '../consts'

export const useApi = (chain: Chains): UseApi => {
  const chainApi = useContext(ApiContext)[chain]

  if (!chainApi) {
    throw new Error(`${chain} is not configured`)
  }

  return chainApi
}
