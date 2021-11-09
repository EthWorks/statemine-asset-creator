import type { ModalStep } from './types'

import { useCallback, useEffect } from 'react'

import { CustomInput } from '../FormElements'
import { useNewAssetModal } from './context/useNewAssetModal'

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, setAssetName, assetNameError, setAssetNameError, assetId, assetSymbol, assetSymbolError, setAssetSymbolError, setAssetId, setAssetSymbol, setAssetDecimals, assetDecimals, stringLimit } = useNewAssetModal()

  const clearErrors = useCallback(() => {
    setAssetNameError(undefined)
    setAssetSymbolError(undefined)
  }, [setAssetNameError, setAssetSymbolError])

  useEffect(() => {
    if(!stringLimit) {
      return
    }

    clearErrors()

    const STRING_LIMIT_EXCEEDED_ERROR = `Maximum length of ${stringLimit} characters exceeded`

    if(assetName.length > stringLimit?.toNumber()) {
      setAssetNameError(STRING_LIMIT_EXCEEDED_ERROR)
    }

    if(assetSymbol.length > stringLimit?.toNumber()) {
      setAssetSymbolError(STRING_LIMIT_EXCEEDED_ERROR)
    }
  }, [assetName, assetSymbol, clearErrors, setAssetNameError, setAssetSymbolError, stringLimit])

  const _onNext = useCallback(() => {
    if(stringLimit && !assetNameError && !assetSymbolError) {
      onNext()
    }
  }, [assetNameError, assetSymbolError, onNext, stringLimit])

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
        error={assetSymbolError}
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
