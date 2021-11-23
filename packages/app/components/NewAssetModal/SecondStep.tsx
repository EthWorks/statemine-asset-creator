import type { ModalStep } from './types'

import { Chains, useActiveAccounts, useApi, useTransaction } from 'use-substrate'

import { useNewAssetModal } from './context/useNewAssetModal'

export function SecondStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { api } = useApi(Chains.Statemine)
  const { activeAccounts } = useActiveAccounts()
  const activeAccount = activeAccounts[Chains.Statemine]

  const txs = activeAccount ? [
    api?.tx.assets.create(assetId, activeAccount.toString(), minBalance),
    api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals)
  ] : []

  const { tx } = useTransaction(api?.tx.utility.batch, [txs], activeAccount?.toString()) || {}

  if (!api || !activeAccount || !tx) return <>Loading..</>

  const _onSubmit = async (): Promise<void> => {
    await tx()
    onNext()
  }

  return (
    <>
      <p>{assetName}</p>
      <p>{assetSymbol}</p>
      <p>{assetDecimals}</p>
      <p>{assetId}</p>
      <p>{minBalance}</p>
      <button onClick={_onSubmit}>Confirm</button>
    </>
  )
}
