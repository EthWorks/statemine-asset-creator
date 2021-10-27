import { CustomInput } from '../FormElements/CustomInput'
import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalStep } from './types'

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, setAssetName, assetId, assetSymbol, setAssetId, setAssetSymbol, setAssetDecimals, assetDecimals } = useNewAssetModal()

  return (
    <div>
      <p>Create asset</p>
      <CustomInput
        value={assetName}
        onChange={setAssetName}
        label="Asset name"
        id="asset-name"
      />
      <CustomInput
        value={assetSymbol}
        onChange={setAssetSymbol}
        label="Asset symbol"
        id="asset-symbol"
      />
      <CustomInput
        value={assetDecimals}
        onChange={setAssetDecimals}
        label="Asset decimals"
        id="asset-decimals"
      />
      <CustomInput
        value={assetId}
        onChange={setAssetId}
        label="Asset ID"
        id="asset-ID"
      />
      <button onClick={onNext}>Next</button>
    </div>
  )
}
