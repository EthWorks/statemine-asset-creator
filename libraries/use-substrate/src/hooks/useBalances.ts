import { useApi } from './useApi'
import { useObservable } from './useObservable'
import type { DeriveBalancesAll } from '@polkadot/api-derive/types'
import { Chains } from '../consts'

export type UseBalances = DeriveBalancesAll | null

export function useBalances(chain: Chains, address: string): UseBalances {
  const { api, connectionState } = useApi(chain)

  const balances = useObservable(api?.derive.balances.all(address), [api, connectionState, address])

  return balances || null
}
