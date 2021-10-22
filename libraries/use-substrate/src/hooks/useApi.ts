import type { UseApi } from '../providers'

import { useContext } from 'react'

import { Chains } from '../consts'
import { ApiContext } from '../providers'

export const useApi = (chain: Chains): UseApi => {
  const chainApi = useContext(ApiContext)[chain]

  if (!chainApi) {
    throw new Error(`${chain} is not configured`)
  }

  return chainApi
}
