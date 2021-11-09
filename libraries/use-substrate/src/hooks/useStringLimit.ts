import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains } from '../consts'
import { useApi } from './useApi'

export const useStringLimit = (chain: Chains): BN => {
  const { api, connectionState } = useApi(chain)

  return useMemo(() => api?.consts.assets.stringLimit as BN, [api, connectionState])
}
