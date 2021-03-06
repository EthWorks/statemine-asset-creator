import type { FormEvent } from 'react'
import type { Asset } from 'use-substrate'
import type { ModalStep } from './types'

import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { useAssets } from 'use-substrate'

import Coin from '../../assets/coin.gif'
import { useAppChains } from '../../utils'
import { ButtonPrimary } from '../button/Button'
import { NumericInput, TextInput } from '../FormElements'
import { ArrowRight } from '../icons'
import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalFooter } from './ModalFooter'

export const DECIMALS_LIMIT = 255

export function FirstStep({ onNext }: ModalStep): JSX.Element {
  const { parachain } = useAppChains()
  const {
    assetName, setAssetName, assetNameError, setAssetNameError, assetId, assetIdError, setAssetIdError, assetSymbol,
    assetSymbolError, setAssetSymbolError, setAssetId, setAssetSymbol, setAssetDecimals, minBalance, setMinBalance,
    assetDecimals, stringLimit, setAssetDecimalsError, assetDecimalsError, minBalanceError, setMinBalanceError
  } = useNewAssetModal()
  const existingAssets = useAssets(parachain)

  const clearErrors = useCallback(() => {
    setAssetNameError(undefined)
    setAssetSymbolError(undefined)
    setAssetIdError(undefined)
    setAssetDecimalsError(undefined)
    setMinBalanceError(undefined)
  }, [setAssetNameError, setAssetSymbolError, setAssetIdError, setAssetDecimalsError, setMinBalanceError])

  const isFilled = !!assetName && !!assetSymbol && !!assetId && !!assetDecimals && !!minBalance
  const isValid = !assetNameError && !assetSymbolError && !assetIdError && !assetDecimalsError && !minBalanceError
  const isDisabled = !isFilled || !isValid

  const isAssetIdUnique = useCallback((assetId: string) => !existingAssets?.find(({ id }: Asset) => id.toString() === assetId), [existingAssets])

  useEffect(() => {
    if (!stringLimit) {
      return
    }

    clearErrors()

    const STRING_LIMIT_EXCEEDED_ERROR = `Maximum length of ${stringLimit} characters exceeded`

    if (assetName.length > stringLimit.toNumber()) {
      setAssetNameError(STRING_LIMIT_EXCEEDED_ERROR)
    }

    if (assetSymbol.length > stringLimit.toNumber()) {
      setAssetSymbolError(STRING_LIMIT_EXCEEDED_ERROR)
    }

    if (!isAssetIdUnique(assetId)) {
      setAssetIdError('Value cannot match an already-existing asset id.')
    }

    if (+assetDecimals > DECIMALS_LIMIT) {
      setAssetDecimalsError('Value too large')
    }

    if (minBalance.length && +minBalance === 0) {
      setMinBalanceError('Non-zero value expected')
    }
  }, [assetId, assetName, assetSymbol, clearErrors, setAssetNameError, setAssetSymbolError, setAssetIdError, stringLimit, isAssetIdUnique, assetDecimals, setAssetDecimalsError, minBalance, setMinBalanceError])

  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (stringLimit && !assetNameError && !assetSymbolError) {
      onNext()
    }
  }, [assetNameError, assetSymbolError, onNext, stringLimit])

  const _generateId = useCallback((): void => {
    const min = Math.ceil(0)
    const max = Math.floor(1000)

    const generatedId = Math.floor(Math.random() * (max - min) + min).toString()

    isAssetIdUnique(generatedId) ? setAssetId(generatedId) : _generateId()
  }, [isAssetIdUnique, setAssetId])

  return (
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
          tooltip='The descriptive name for this asset, e.g. "Kusama", "Polkadot"'
          placeholder='Type your asset name'
        />
      </FormHead>
      <TextInput
        error={assetSymbolError}
        value={assetSymbol}
        onChange={setAssetSymbol}
        label="Asset symbol"
        id="asset-symbol"
        tooltip='The symbol that will represent this asset, e.g. "KSM", "DOT"'
      />
      <NumericInput
        error={assetDecimalsError}
        value={assetDecimals}
        onChange={setAssetDecimals}
        label="Asset decimals"
        id="asset-decimals"
        inputType='NATURAL'
        hint={`Max allowed value is ${DECIMALS_LIMIT}`}
        tooltip='The number of decimal places for this Asset.'
      />
      <NumericInput
        error={assetIdError}
        value={assetId}
        onChange={setAssetId}
        label="Asset ID"
        id="asset-ID"
        inputType='NATURAL'
        button={{
          label: 'Generate random ID',
          onClick: _generateId
        }}
        tooltip='The selected id for the asset. This cannot match an already-existing asset id.'
      />
      <NumericInput
        error={minBalanceError}
        value={minBalance}
        onChange={setMinBalance}
        label="Minimum balance"
        id="min-balance"
        inputType='NATURAL'
        tooltip='The minimum balance for the asset. This is specified in the units and decimals as requested'
      />
      <ModalFooter>
        <ButtonPrimary type='submit' disabled={isDisabled}>
            Next
          <ArrowRight />
        </ButtonPrimary>
      </ModalFooter>
    </form>
  )
}

const FormHead = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-column-gap: 48px;
  align-items: center;
  margin-bottom: 24px;
`

const CoinWrapper = styled.div`
  height: 120px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
