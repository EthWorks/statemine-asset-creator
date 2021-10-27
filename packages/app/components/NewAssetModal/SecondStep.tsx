import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalStep } from './types'

export function SecondStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId } = useNewAssetModal()

  return (
    <div>
      <p>Create asset</p>
      <p>{assetName}</p>
      <p>{assetSymbol}</p>
      <p>{assetDecimals}</p>
      <p>{assetId}</p>
      <button onClick={onNext}>Confirm</button>
    </div>
  )
}
