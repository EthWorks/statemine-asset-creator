import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains, useBalances, useBalancesConstants } from 'use-substrate'

export function useRequireTeleport(owner: string | undefined, transactionFee: BN | undefined, createAssetDeposit: BN | undefined): boolean | undefined {
  const { availableBalance } = useBalances(owner, Chains.Statemine) || {}

  const { existentialDeposit } = useBalancesConstants(Chains.Statemine) || {}

  return useMemo(() => {
    if (!transactionFee || !createAssetDeposit || !existentialDeposit || !availableBalance) return undefined

    const teleportAmount = existentialDeposit.add(transactionFee).add(createAssetDeposit)

    return teleportAmount.gt(availableBalance)
  }, [availableBalance, createAssetDeposit, existentialDeposit, transactionFee])
}
