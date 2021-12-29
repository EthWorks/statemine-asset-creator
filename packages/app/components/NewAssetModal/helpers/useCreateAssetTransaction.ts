import type { StepDetails } from './getTransactionModalDetails'

import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains, TransactionStatus, useActiveAccount, useApi, useCreateAssetDeposit, useTransaction } from 'use-substrate'

import { useNewAssetModal } from '../context/useNewAssetModal'
import { getCreateAssetTransactionModalDetails } from './getTransactionModalDetails'

interface UseThirdStep {
  tx: (() => Promise<void>) | undefined,
  status: TransactionStatus | undefined,
  stepDetails: StepDetails
  transactionFee: BN | undefined,
  createAssetDeposit: BN | undefined
}

export function useCreateAssetTransaction(): UseThirdStep {
  const { admin, issuer, freezer, assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { api } = useApi(Chains.Statemine)
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}
  const createAssetDeposit = useCreateAssetDeposit(Chains.Statemine, assetName, assetSymbol)

  const txs = useMemo(() => admin && issuer && freezer
    ? admin.address === issuer.address && admin.address === freezer.address
      ? [
        api?.tx.assets.create(assetId, admin.address, minBalance),
        api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals)
      ]
      : [
        api?.tx.assets.create(assetId, admin.address, minBalance),
        api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals),
        api?.tx.assets.setTeam(assetId, issuer.address, admin.address, freezer.address)
      ]
    : [], [admin, issuer, freezer, api, assetDecimals, assetId, assetName, assetSymbol, minBalance])

  const { tx, status, errorDetails, paymentInfo } = useTransaction(api?.tx.utility.batchAll, [txs], ownerAddress?.toString()) || {}
  const stepDetails = useMemo(() => getCreateAssetTransactionModalDetails(status, errorDetails), [status, errorDetails])

  return {
    tx,
    stepDetails,
    status,
    transactionFee: paymentInfo?.partialFee,
    createAssetDeposit
  }
}
