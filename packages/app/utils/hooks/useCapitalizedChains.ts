import { useMemo } from 'react'

import { Chains } from 'use-substrate'

import { capitalizeFirstLetter } from '../../formatters'

export function useCapitalizedChains(chains: Chains[]): string[] {
  return useMemo(() => chains.map((chain) => capitalizeFirstLetter(chain)), [chains])
}
