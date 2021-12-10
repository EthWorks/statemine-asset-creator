import type { ModalStep } from './types'

import { useEffect, useState } from 'react'

import { Chains, TransactionStatus, useActiveAccount } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { InfoRow, TransactionInfoBlock } from '../TransactionInfoBlock/TransactionInfoBlock'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { useThirdStep } from './helpers/useThirdStep'
import { StatusStep } from './StatusStep/StatusStep'
import { ModalFooter } from './ModalFooter'

interface StepBarProps {
  setStepBarVisible: (arg: boolean) => void
}

export function ThirdStep({ onBack, setStepBarVisible }: ModalStep & StepBarProps): JSX.Element {
  const { tx, status, stepDetails } = useThirdStep()
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}
  const [isContentVisible, setIsContentVisible] = useState<boolean>(true)

  useEffect(() => {
    if (status === TransactionStatus.Ready || status === TransactionStatus.AwaitingSign) {
      setIsContentVisible(true)
      setStepBarVisible(true)
    } else {
      setIsContentVisible(false)
      setStepBarVisible(false)
    }
  }, [setStepBarVisible, status])

  if (!ownerAddress && !tx && !status) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    tx && await tx()
  }

  const areButtonsDisabled = status !== TransactionStatus.Ready

  return (
    <>
      {stepDetails && <StatusStep status={status} title={stepDetails.title} text={stepDetails.text} name={stepDetails.name} number={stepDetails.number}/>}
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
            <ButtonOutline onClick={onBack} disabled={areButtonsDisabled}>
              <ArrowLeft />
              Back
            </ButtonOutline>
            <ButtonPrimary onClick={_onSubmit} disabled={areButtonsDisabled}>
              Confirm
              <ArrowRight />
            </ButtonPrimary>
          </ModalFooter>
        </div>
      )}
    </>
  )
}
