import type { AccountId } from '@polkadot/types/interfaces'
import type { TeleportInput, UseTeleport } from 'use-substrate'

import BN from 'bn.js'
import { useMemo } from 'react'

import {
  Chains,
  TransactionStatus,
  useActiveAccount,
  useBalances,
  useBalancesConstants,
  useTeleport
} from 'use-substrate'

import { BN_ZERO } from '../../../utils'
import { getTeleportTransactionModalDetails, StepDetails } from './getTransactionModalDetails'

interface UseRequireTeleport {
  displayTeleportContent: boolean,
  teleportAmount: BN,
  teleport: UseTeleport,
  stepDetails: StepDetails
}

export function useTeleportTransaction(owner: AccountId | undefined, transactionFee: BN | undefined, createAssetDeposit: BN | undefined): UseRequireTeleport | undefined {
  const { availableBalance } = useBalances(owner?.toString(), Chains.Statemine) || {}
  const { activeAccount: kusamaActiveAccount } = useActiveAccount(Chains.Kusama)
  const { existentialDeposit } = useBalancesConstants(Chains.Statemine) || {}

  const { isTeleportRequired, teleportAmount } = useMemo(() => {
    if (!transactionFee || !createAssetDeposit || !existentialDeposit || !availableBalance) return undefined

    const teleportAmount = existentialDeposit.add(transactionFee).add(createAssetDeposit)

    return {
      isTeleportRequired: teleportAmount.gt(availableBalance),
      teleportAmount
    }
  }, [availableBalance, createAssetDeposit, existentialDeposit, transactionFee]) || {}

  const SENDER: TeleportInput = { account: kusamaActiveAccount?.address, chain: Chains.Kusama }
  const RECIPIENT: TeleportInput = { account: owner, chain: Chains.Statemine }

  const teleport = useTeleport(SENDER, RECIPIENT, teleportAmount ?? BN_ZERO)
  const stepDetails = useMemo(() => getTeleportTransactionModalDetails(teleport?.status, teleport?.errorDetails), [teleport])

  const displayTeleportContent = useMemo(() => {
    return teleport?.status !== TransactionStatus.Ready || (teleport.status === TransactionStatus.Ready && isTeleportRequired)
  }, [isTeleportRequired, teleport?.status])

  return displayTeleportContent !== undefined && teleportAmount && teleport
    ? {
      displayTeleportContent,
      teleportAmount,
      teleport,
      stepDetails
    }
    : undefined
}
