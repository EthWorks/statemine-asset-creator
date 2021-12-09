import type { ModalStep } from './types'

import {Chains, TransactionStatus, useActiveAccount} from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { InfoRow, TransactionInfoBlock } from '../TransactionInfoBlock/TransactionInfoBlock'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { useThirdStep } from './helpers/useThirdStep'
import { StatusStep } from './StatusStep/StatusStep'
import { ModalFooter } from './ModalFooter'
import {useEffect} from "react";

export function ThirdStep({ onNext, onBack }: ModalStep): JSX.Element {
  const { state, dispatch, status } = useThirdStep()
  const { statusStep, isContentVisible } = state
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}

  if (!ownerAddress) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    await dispatch({ type: 'createAsset' })
  }

  return (
    <>
      {statusStep && <StatusStep status={status} title={statusStep.title} text={statusStep.text}/>}
      {isContentVisible && (
        <div data-testid='third-step-content'>
          <TransactionInfoBlock>
            <InfoRow>
              <Label>Asset name</Label>
              <Text size='XS' color='white' bold>{assetName}</Text>
            </InfoRow>
            <InfoRow>
              <Label>Asset symbol</Label>
              <Text size='XS' color='white' bold>{assetSymbol}</Text>
            </InfoRow>
            <InfoRow>
              <Label>Asset decimals</Label>
              <Text size='XS' color='white' bold>{assetDecimals}</Text>
            </InfoRow>
            <InfoRow>
              <Label>Asset minimal balance</Label>
              <Text size='XS' color='white' bold>{minBalance}</Text>
            </InfoRow>
            <InfoRow>
              <Label>Asset id</Label>
              <Text size='XS' color='white' bold>{assetId}</Text>
            </InfoRow>
          </TransactionInfoBlock>

          <ModalFooter contentPosition='between'>
            <ButtonOutline onClick={onBack}>
              <ArrowLeft />
          Back
            </ButtonOutline>
            <ButtonPrimary onClick={_onSubmit}>
          Confirm
              <ArrowRight />
            </ButtonPrimary>
          </ModalFooter>
        </div>
      )}
    </>
  )
}
