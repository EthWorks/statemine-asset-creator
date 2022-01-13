import { useMemo } from 'react'

import { Chains } from 'use-substrate'

import { capitalizeFirstLetter } from '../../formaters/formaters'

export function useCapitalizedChains(chains: Chains[]): string[] {
  return useMemo(() => chains.map((chain) => capitalizeFirstLetter(chain)), [chains])
}
