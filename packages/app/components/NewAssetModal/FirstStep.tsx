import type { FormEvent } from 'react'
import type { Asset } from 'use-substrate'
import type { ModalStep } from './types'

import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { Chains, useAssets } from 'use-substrate'

import Coin from '../../assets/coin.gif'
import { ButtonPrimary } from '../button/Button'
import { NumericInput, TextInput } from '../FormElements'
import { Arrow } from '../icons/Arrow'
import { ModalFooter } from '../Modal/ModalFooter'
import { useNewAssetModal } from './context/useNewAssetModal'
import { StepsBar } from './StepsBar/StepsBar'

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

  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(stringLimit && !assetNameError && !assetSymbolError) {
      onNext()
    }
  }, [assetNameError, assetSymbolError, onNext, stringLimit])

  return (
    <>
      <StepsBar stepNumber={0} />
      <form onSubmit={_onNext}>
        <FormHead>
          <CoinWrapper>
            <Image src={Coin} alt='' />
          </CoinWrapper>
          <TextInput
            error={assetNameError}
            value={assetName}
            onChange={setAssetName}
            label="Asset name"
            id="asset-name"
            large
            autoFocus
          />
        </FormHead>
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
          inputType='NATURAL'
        />
        <NumericInput
          error={assetIdError}
          value={assetId}
          onChange={setAssetId}
          label="Asset ID"
          id="asset-ID"
          inputType='NATURAL'
        />
        <NumericInput
          value={minBalance}
          onChange={setMinBalance}
          label="Minimum balance"
          id="min-balance"
          inputType='POSITIVE'
        />
        <ModalFooter>
          <ButtonPrimary type='submit' disabled={isDisabled}>
            Next
            <Arrow direction='right' width='14' height='9' />
          </ButtonPrimary>
        </ModalFooter>
      </form>
    </>
  )
}

const FormHead = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-column-gap: 48px;
  align-items: center;
  margin: 24px 0;
`

const CoinWrapper = styled.div`
  height: 120px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
