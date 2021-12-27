import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains, useBalances, useBalancesConstants } from 'use-substrate'

const THRESHOLD = 1.1

export function useRequireTeleport(owner: string | undefined, transactionFee: BN | undefined, createAssetDeposit: BN | undefined): boolean | undefined {
  const { availableBalance } = useBalances(owner, Chains.Statemine) || {}

  const { existentialDeposit } = useBalancesConstants(Chains.Statemine) || {}

  return useMemo(() => {
    if (!transactionFee || !createAssetDeposit || !existentialDeposit || !availableBalance) return undefined

    const teleportAmount = existentialDeposit.add(transactionFee).add(createAssetDeposit)

    const teleportAmountWithThreshold = teleportAmount.muln(THRESHOLD)

    return teleportAmountWithThreshold.gt(availableBalance)
  }, [availableBalance, createAssetDeposit, existentialDeposit, transactionFee])
}
