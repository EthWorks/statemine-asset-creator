import { useNewAssetModal } from './context/useNewAssetModal'

export function SecondStep(): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId } = useNewAssetModal()

  return (
    <div>
      <p>Create asset</p>
      <p>{assetName}</p>
      <p>{assetSymbol}</p>
      <p>{assetDecimals}</p>
      <p>{assetId}</p>
      <button>Confirm</button>
    </div>
  )
}
