import { useMemo } from 'react'

import { useAppChains } from './useAppChains'

const STATESCAN_LINK_TEMPLATE = 'https://chain.statescan.io/asset/'

export function useStatescanLink(): string {
  const { parachain } = useAppChains()

  return useMemo(() => STATESCAN_LINK_TEMPLATE.replace(/chain/g, parachain), [parachain])
}
