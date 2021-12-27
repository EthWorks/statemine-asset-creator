import BN from 'bn.js'

import { Chains, useBalances, useBalancesConstants } from 'use-substrate'

const THRESHOLD = 1.1

export function useRequireTeleport(owner: string | undefined, transactionFee: BN | undefined, createAssetDeposit: BN | undefined): boolean | undefined {
  const { availableBalance } = useBalances(owner, Chains.Statemine) || {}

  const { existentialDeposit } = useBalancesConstants(Chains.Statemine) || {}

  if (!transactionFee || !createAssetDeposit || !availableBalance || !existentialDeposit) return undefined

  const teleportAmount = existentialDeposit.add(transactionFee).add(createAssetDeposit)
  const teleportAmountWithThreshold = teleportAmount?.muln(THRESHOLD)

  return teleportAmountWithThreshold.gt(availableBalance)
}
