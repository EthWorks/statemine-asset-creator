import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains, useBalances, useBalancesConstants } from 'use-substrate'

interface UseRequireTeleport {
  isTeleportRequired: boolean,
  teleportAmount: BN
}

export function useTeleport(owner: string | undefined, transactionFee: BN | undefined, createAssetDeposit: BN | undefined): UseRequireTeleport | undefined {
  const { availableBalance } = useBalances(owner, Chains.Statemine) || {}

  const { existentialDeposit } = useBalancesConstants(Chains.Statemine) || {}

  return useMemo(() => {
    if (!transactionFee || !createAssetDeposit || !existentialDeposit || !availableBalance) return undefined

    const teleportAmount = existentialDeposit.add(transactionFee).add(createAssetDeposit)

    return {
      isTeleportRequired: teleportAmount.gt(availableBalance),
      teleportAmount
    }
  }, [availableBalance, createAssetDeposit, existentialDeposit, transactionFee])
}
