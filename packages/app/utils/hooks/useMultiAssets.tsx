import { AccountId } from '@polkadot/types/interfaces'

import { Chains, UseAssets, useAssets } from 'use-substrate'

export function useMultiAssets(owner?: AccountId): Partial<Record<Chains, UseAssets>> {
  const statemintAssets = useAssets(Chains.Statemint, { owner })
  const statemineAssets = useAssets(Chains.Statemine, { owner })

  return {
    [Chains.Statemine]: statemineAssets,
    [Chains.Statemint]: statemintAssets
  }
}
