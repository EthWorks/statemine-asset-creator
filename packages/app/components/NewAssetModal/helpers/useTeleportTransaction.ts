import type { AccountId } from '@polkadot/types/interfaces'
import type { TeleportInput } from 'use-substrate'

import BN from 'bn.js'
import { useMemo } from 'react'

import { TransactionStatus, useActiveAccount, useBalances, useBalancesConstants, useTeleport } from 'use-substrate'

import { BN_ZERO, useAppChains } from '../../../utils'
import { Transaction } from '../types'
import { getTeleportTransactionModalDetails } from './getTransactionModalDetails'

interface UseRequireTeleport extends Transaction {
  displayTeleportContent: boolean,
  teleportAmount: BN,
}

export function useTeleportTransaction(owner: AccountId | undefined, transactionFee: BN | undefined, createAssetDeposit: BN | undefined): UseRequireTeleport | undefined {
  const { paraChain, relayChain } = useAppChains()
  const { availableBalance } = useBalances(owner?.toString(), paraChain) || {}
  const { activeAccount: kusamaActiveAccount } = useActiveAccount(relayChain)
  const { existentialDeposit } = useBalancesConstants(paraChain) || {}

  const { isTeleportRequired, teleportAmount } = useMemo(() => {
    if (!transactionFee || !createAssetDeposit || !existentialDeposit || !availableBalance) return undefined

    const teleportAmount = existentialDeposit.add(transactionFee).add(createAssetDeposit)

    return {
      isTeleportRequired: teleportAmount.gt(availableBalance),
      teleportAmount
    }
  }, [availableBalance, createAssetDeposit, existentialDeposit, transactionFee]) || {}

  const sender: TeleportInput = { account: kusamaActiveAccount?.address, chain: relayChain }
  const recipient: TeleportInput = { account: owner, chain: paraChain }

  const transaction = useTeleport(sender, recipient, teleportAmount ?? BN_ZERO)
  const stepDetails = useMemo(() => getTeleportTransactionModalDetails(transaction?.status, transaction?.errorDetails), [transaction])

  const displayTeleportContent = useMemo(() => {
    return transaction?.status !== TransactionStatus.Ready || (transaction.status === TransactionStatus.Ready && isTeleportRequired)
  }, [isTeleportRequired, transaction?.status])

  return displayTeleportContent !== undefined && teleportAmount && transaction
    ? {
      displayTeleportContent,
      teleportAmount,
      transaction,
      stepDetails
    }
    : undefined
}
