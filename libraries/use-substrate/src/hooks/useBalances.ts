import type { DeriveBalancesAll } from '@polkadot/api-derive/types'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

interface Balances extends DeriveBalancesAll {
  chainDecimals: number,
  chainToken: string
}

export type UseBalances = Balances | undefined

export function useBalances(address: string | undefined, chain: Chains): UseBalances {
  const { api, connectionState } = useApi(chain)
  const balances = useObservable(address ? api?.derive.balances.all(address) : undefined, [api, connectionState, address])

  const chainDecimals = api?.registry.chainDecimals[0]
  const chainToken = api?.registry.chainTokens[0]

  return (balances && chainDecimals && chainToken)
    ? {
      ...balances,
      chainDecimals,
      chainToken
    }
    : undefined
}
