import type { ModalStep } from './types'

import { useNewAssetModal } from './context/useNewAssetModal'

export function SecondStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId } = useNewAssetModal()

  return (
    <>
      <p>Create asset</p>
      <p>{assetName}</p>
      <p>{assetSymbol}</p>
      <p>{assetDecimals}</p>
      <p>{assetId}</p>
      <button onClick={onNext}>Confirm</button>
    </>
  )
}
