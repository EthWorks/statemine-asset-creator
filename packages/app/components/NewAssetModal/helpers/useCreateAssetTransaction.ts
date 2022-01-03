import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains, useActiveAccount, useApi, useCreateAssetDeposit, useTransaction } from 'use-substrate'

import { useNewAssetModal } from '../context/useNewAssetModal'
import { Transaction } from '../types'
import { getCreateAssetTransactionModalDetails } from './getTransactionModalDetails'

interface UseCreateAssetTransaction extends Transaction {
  createAssetDeposit: BN
}

export function useCreateAssetTransaction(): UseCreateAssetTransaction | undefined {
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

  const transaction = useTransaction(api?.tx.utility.batchAll, [txs], ownerAddress?.toString())
  const { status, errorDetails, paymentInfo } = transaction || {}
  const stepDetails = useMemo(() => getCreateAssetTransactionModalDetails(status, errorDetails), [status, errorDetails])

  return transaction && paymentInfo && createAssetDeposit
    ? {
      stepDetails,
      transaction,
      createAssetDeposit
    }
    : undefined
}
