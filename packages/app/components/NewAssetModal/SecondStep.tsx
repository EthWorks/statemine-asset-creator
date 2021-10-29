import type { ModalStep } from './types'

import { Chains, useApi, useTransaction } from 'use-substrate'

import { useNewAssetModal } from './context/useNewAssetModal'

export function SecondStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId } = useNewAssetModal()
  const { api } = useApi(Chains.Local)
  const account = localStorage.getItem('activeAccount')

  const txs = account ? [
    api?.tx.assets.create(assetId, account, 100),
    api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals)
  ] : []

  const { tx } = useTransaction(api?.tx.utility.batch, [txs], account) || {}

  console.log('api:', api)
  console.log('account:', account)
  console.log('tx:', tx)

  if (!api || !account || !tx) return <>Loading..</>

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
      <button onClick={_onSubmit}>Confirm</button>
    </>
  )
}
