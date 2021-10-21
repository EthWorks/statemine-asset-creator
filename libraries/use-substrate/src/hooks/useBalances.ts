import { useApi } from './useApi'
import { useObservable } from './useObservable'
import type { DeriveBalancesAll } from '@polkadot/api-derive/types'
import { SupportedChain } from '../types'

export type UseBalances = DeriveBalancesAll | null

export function useBalances(chain: SupportedChain, address: string): UseBalances {
  const { api, connectionState } = useApi(chain)

  const balances = useObservable(api?.derive.balances.all(address), [api, connectionState, address])

  return balances || null
}
