import type { DeriveBalancesAll } from '@polkadot/api-derive/types'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

export type UseBalances = DeriveBalancesAll | undefined

export function useBalances(address: string | null, chain: Chains): UseBalances {
  const { api, connectionState } = useApi(chain)

  return useObservable(address ? api?.derive.balances.all(address) : undefined, [api, connectionState, address])
}
