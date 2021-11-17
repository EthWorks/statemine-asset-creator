import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains } from '../consts'
import { useApi } from './useApi'

interface UseAssetsConstants {
  /**The maximum length of a name or symbol stored on-chain.*/
  stringLimit: BN | undefined
}

export const useAssetsConstants = (chain: Chains): UseAssetsConstants => {
  const { api, connectionState } = useApi(chain)

  return useMemo(() => ({
    stringLimit: api?.consts.assets.stringLimit.toBn()
  }), [api, connectionState])
}
