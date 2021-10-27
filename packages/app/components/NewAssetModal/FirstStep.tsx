import { CustomInput } from '../FormElements/CustomInput'
import { useNewAssetModal } from './context/useNewAssetModal'

interface Props {
  onNext: () => void
}
export function FirstStep({ onNext }: Props): JSX.Element {
  const { assetName, setAssetName, assetId, assetSymbol, setAssetId, setAssetSymbol, setAssetDecimals, assetDecimals } = useNewAssetModal()
  const _onClick = (): void => {
    onNext()
  }
  
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
      <button onClick={_onClick}>Next</button>
    </div>
  )
}
