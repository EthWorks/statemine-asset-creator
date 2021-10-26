import type { DeriveBalancesAll } from '@polkadot/api-derive/types'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

export type UseBalances = DeriveBalancesAll | null | undefined

export function useBalances(address: string | null, chain: Chains): UseBalances {
  if (!address) return undefined

  const { api, connectionState } = useApi(chain)

  const balances = useObservable(api?.derive.balances.all(address), [api, connectionState, address])

  return balances || null
}
