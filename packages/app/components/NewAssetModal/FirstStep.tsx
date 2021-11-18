import type { Asset } from 'use-substrate'
import type { ModalStep } from './types'

import { FormEvent, useCallback, useEffect } from 'react'

import { Chains, useAssets } from 'use-substrate'

import { ButtonPrimary } from '../button/Button'
import { CustomInput } from '../FormElements'
import { useNewAssetModal } from './context/useNewAssetModal'

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, setAssetName, assetNameError, setAssetNameError, assetId, assetIdError, setAssetIdError, assetSymbol,
    assetSymbolError, setAssetSymbolError, setAssetId, setAssetSymbol, setAssetDecimals, minBalance, setMinBalance,
    assetDecimals, stringLimit } = useNewAssetModal()
  const existingAssets = useAssets(Chains.Statemine)

  const clearErrors = useCallback(() => {
    setAssetNameError(undefined)
    setAssetSymbolError(undefined)
    setAssetIdError(undefined)
  }, [setAssetNameError, setAssetSymbolError, setAssetIdError])

  const isFilled = !!assetName && !!assetSymbol && !!assetId && !!assetDecimals && !!minBalance
  const isValid = !assetNameError && !assetSymbolError && !assetIdError
  const isDisabled = !isFilled || !isValid

  const isValidInteger = useCallback(() => {
    const integer = +assetId

    return !!(integer && integer > 0)
  }, [assetId])

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

    if(assetId && !isValidInteger()) {
      setAssetIdError('Value must be a positive number')
    }

    if(assetId && isValidInteger() && !isAssetIdUnique()) {
      setAssetIdError('Value cannot match an already-existing asset id.')
    }
  }, [assetId, assetName, assetSymbol, clearErrors, setAssetNameError, setAssetSymbolError, setAssetIdError, stringLimit, isValidInteger, isAssetIdUnique])

  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(stringLimit && !assetNameError && !assetSymbolError) {
      onNext()
    }
  }, [assetNameError, assetSymbolError, onNext, stringLimit])

  return (
    <form onSubmit={_onNext}>
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
        error={assetIdError}
        value={assetId}
        onChange={setAssetId}
        label="Asset ID"
        id="asset-ID"
      />
      <CustomInput
        value={minBalance}
        onChange={setMinBalance}
        label="Minimum balance"
        id="min-balance"
      />
      <ButtonPrimary type='submit' disabled={isDisabled}>Next</ButtonPrimary>
    </form>
  )
}
