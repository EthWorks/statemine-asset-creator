import type { ModalStep } from './types'

import { useCallback, useEffect } from 'react'

import { CustomInput } from '../FormElements'
import { useNewAssetModal } from './context/useNewAssetModal'

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, setAssetName, assetNameError, setAssetNameError, assetId, assetSymbol, setAssetId, setAssetSymbol, setAssetDecimals, assetDecimals, stringLimit } = useNewAssetModal()

  useEffect(() => {
    if(!stringLimit) {
      return
    }
    setAssetNameError(undefined)
    if(assetName.length > stringLimit?.toNumber()) {
      setAssetNameError(`Maximum length of ${stringLimit} characters exceeded`)
    }
  }, [assetName, setAssetNameError, stringLimit])

  const _onNext = useCallback(() => {
    if(stringLimit && !assetNameError) {
      onNext()
    }
  }, [assetNameError, onNext, stringLimit])

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
