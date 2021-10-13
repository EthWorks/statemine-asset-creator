import { useApi } from './useApi'
import { useObservable } from './useObservable'
import type { DeriveBalancesAll } from '@polkadot/api-derive/types'

export type UseBalances = DeriveBalancesAll | null

export function useBalances(address: string): UseBalances {
  const { api, connectionState } = useApi()

  const balances = useObservable(api?.derive.balances.all(address), [api, connectionState, address])

  return balances || null
}