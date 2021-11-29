import type { BlockNumber } from '@polkadot/types/interfaces'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

export function useBestNumber(chain: Chains): BlockNumber | undefined {
  const { api } = useApi(chain)

  return useObservable<BlockNumber>(api?.derive.chain.bestNumber(), [api])
}
