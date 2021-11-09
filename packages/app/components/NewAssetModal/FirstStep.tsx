import type { ModalStep } from './types'

import { useCallback, useEffect } from 'react'

import { CustomInput } from '../FormElements'
import { useNewAssetModal } from './context/useNewAssetModal'

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, setAssetName, assetNameError, setAssetNameError, assetId, assetSymbol, setAssetId, setAssetSymbol, setAssetDecimals, assetDecimals } = useNewAssetModal()
  const assetNameLengthLimit = 50

  useEffect(() => {
    setAssetNameError(undefined)
    if(assetName.length > assetNameLengthLimit) {
      setAssetNameError(`Maximum length of ${assetNameLengthLimit} characters exceeded`)
    }
  }, [assetName, setAssetNameError])

  const _onNext = useCallback(() => {
    if(!assetNameError) {
      onNext()
    }
  }, [assetNameError, onNext])

  return (
    <>
      <CustomInput
        error={assetNameError}
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
      <button onClick={_onNext}>Next</button>
    </>
  )
}
