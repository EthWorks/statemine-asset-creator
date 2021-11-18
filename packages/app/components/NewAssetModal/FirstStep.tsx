import type { Asset } from 'use-substrate'
import type { ModalStep } from './types'

import { useCallback, useEffect } from 'react'

import { Chains, useAssets } from 'use-substrate'

import { NumericInput, TextInput } from '../FormElements'
import { useNewAssetModal } from './context/useNewAssetModal'

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, setAssetName, assetNameError, setAssetNameError, assetId, assetIdError, setAssetIdError, assetSymbol, assetSymbolError, setAssetSymbolError, setAssetId, setAssetSymbol, setAssetDecimals, assetDecimals, stringLimit } = useNewAssetModal()
  const existingAssets = useAssets(Chains.Statemine)
    
  const clearErrors = useCallback(() => {
    setAssetNameError(undefined)
    setAssetSymbolError(undefined)
    setAssetIdError(undefined)
  }, [setAssetNameError, setAssetSymbolError, setAssetIdError])

  const isAssetIdUnique = useCallback(() => !existingAssets?.find(({ id }: Asset) => id.toString() === assetId), [existingAssets, assetId])
    
  useEffect(() => {
    if(!stringLimit) {
      return
    }

    clearErrors()

    const STRING_LIMIT_EXCEEDED_ERROR = `Maximum length of ${stringLimit} characters exceeded`

    if(assetName.length > stringLimit.toNumber()) {
      setAssetNameError(STRING_LIMIT_EXCEEDED_ERROR)
    }

    if(assetSymbol.length > stringLimit.toNumber()) {
      setAssetSymbolError(STRING_LIMIT_EXCEEDED_ERROR)
    }

    if(assetId && !isAssetIdUnique()) {
      setAssetIdError('Value cannot match an already-existing asset id.')
    }
  }, [assetId, assetName, assetSymbol, clearErrors, setAssetNameError, setAssetSymbolError, setAssetIdError, stringLimit, isAssetIdUnique])

  const _onNext = useCallback(() => {
    if(stringLimit && !assetNameError && !assetSymbolError) {
      onNext()
    }
  }, [assetNameError, assetSymbolError, onNext, stringLimit])

  return (
    <>
      <TextInput
        error={assetNameError}
        value={assetName}
        onChange={setAssetName}
        label="Asset name"
        id="asset-name"
      />
      <TextInput
        error={assetSymbolError}
        value={assetSymbol}
        onChange={setAssetSymbol}
        label="Asset symbol"
        id="asset-symbol"
      />
      <NumericInput
        value={assetDecimals}
        onChange={setAssetDecimals}
        label="Asset decimals"
        id="asset-decimals"
        nonNegative
        nonDecimal
      />
      <NumericInput
        error={assetIdError}
        value={assetId}
        onChange={setAssetId}
        label="Asset ID"
        id="asset-ID"
        nonNegative
        nonDecimal
      />
      <button onClick={_onNext}>Next</button>
    </>
  )
}
