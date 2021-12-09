import { useCallback, useMemo, useReducer } from 'react'

import { Chains, TransactionStatus, useActiveAccount, useApi, useTransaction } from 'use-substrate'

import { useNewAssetModal } from '../context/useNewAssetModal'
import { StatusStepProps } from '../StatusStep/StatusStep'

const initState: State = {
  isContentVisible: true,
  statusStep: undefined
}

type Action = { type: 'createAsset' }

type State = {
  isContentVisible: boolean,
  statusStep: Omit<StatusStepProps, 'status'> | undefined
}

export function useThirdStep(): {state: State, dispatch: (action: Action) => void, status: TransactionStatus | undefined} {
  const [state, dispatch] = useReducer(reducer, initState)
  const { admin, issuer, freezer, assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { api } = useApi(Chains.Statemine)
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}

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

  const { tx, status } = useTransaction(api?.tx.utility.batchAll, [txs], ownerAddress?.toString()) || {}
  console.log('transactionStatus', status)

  function reducer(state: State, action: Action): State {
    let newState
    switch (action.type) {
      case 'createAsset':
        newState = {
          ...state,
          isContentVisible: false,
          statusStep: {
            name: 'Asset Creation',
            number: 1,
            title: 'Pending transaction 1/1...',
            text: 'It takes time to create your asset. In order to do so, we need to create a transaction and wait until blockchain validates it.'
          }
        }
        break
    }

    return newState
  }

  const customDispatch = useCallback(async (action: Action) => {
    switch (action.type) {
      case 'createAsset': {
        tx && await tx()
        dispatch({
          type: 'createAsset'

        })
        break
      }
    }
  }, [tx, status])

  return {
    state,
    dispatch: customDispatch,
    status
  }
}
