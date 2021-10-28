import type { ModalStep } from './types'

import { Chains, useApi, useTransfer } from 'use-substrate'

import { useNewAssetModal } from './context/useNewAssetModal'

export function SecondStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId } = useNewAssetModal()
  const { api } = useApi(Chains.Local)
  const account = localStorage.getItem('activeAccount')

  const { tx } = useTransfer(api?.tx.assets.create, [999, account, 100], account) || {}

  if (!api || !account || !tx) return <>Loading..</>

  const _onSubmit = async (): Promise<void> => {
    tx()
    onNext()
  }

  return (
    <>
      <p>Create asset</p>
      <p>{assetName}</p>
      <p>{assetSymbol}</p>
      <p>{assetDecimals}</p>
      <p>{assetId}</p>
      <button onClick={_onSubmit}>Confirm</button>
    </>
  )
}
