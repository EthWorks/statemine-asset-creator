import BN from 'bn.js'

import { Chains } from '../consts'
import { useApi } from './useApi'

interface UseBalancesConstants {
  existentialDeposit: BN
}

export function useBalancesConstants(chain: Chains): UseBalancesConstants | undefined {
  const { api } = useApi(chain)

  if (!api) return undefined

  const { existentialDeposit } = api.consts.balances

  return {
    existentialDeposit: existentialDeposit.toBn()
  }
}
