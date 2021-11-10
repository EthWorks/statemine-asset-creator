import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains } from '../consts'
import { useApi } from './useApi'

export const useStringLimit = (chain: Chains): BN | undefined => {
  const { api, connectionState } = useApi(chain)

  return useMemo(() => api?.consts.assets.stringLimit.toBn(), [api, connectionState])
}
