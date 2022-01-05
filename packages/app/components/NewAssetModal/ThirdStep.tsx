import type { ModalStep } from './types'

import { useEffect, useState } from 'react'

import { Chains, useActiveAccount, useChainToken } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { FormatBalance } from '../FormatBalance'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { InfoRow, TransactionInfoBlock } from '../TransactionInfoBlock/TransactionInfoBlock'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { TransactionState } from './TransactionState/TransactionState'
import { mapToTransactionInfoBlockStatus, useCreateAssetTransaction, useTeleportTransaction } from './helpers'
import { ModalFooter } from './ModalFooter'

enum ThirdStepState {
  Loading = 'Loading',
  TeleportReady = 'TeleportReady',
  InProgress = 'InProgress',
  TeleportDone = 'TeleportDone',
  CreateAssetReady = 'CreateAssetReady',
  Success = 'Success',
  Error = 'Error',
  AwaitingSign = 'AwaitingSign',
}

interface StepBarProps {
  setStepBarVisible: (arg: boolean) => void
}

export function ThirdStep({ onNext, onBack, setStepBarVisible }: ModalStep & StepBarProps): JSX.Element {
  const [state, setState] = useState<ThirdStepState>(ThirdStepState.Loading)
  const { transaction: createAssetTransaction, stepDetails: createAssetStepDetails, createAssetDeposit } = useCreateAssetTransaction() || {}
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()

  const transactionFee = createAssetTransaction?.paymentInfo?.partialFee
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}
  const { displayTeleportContent, teleportAmount, transaction: teleportTransaction, stepDetails: teleportStepDetails } = useTeleportTransaction(ownerAddress, transactionFee, createAssetDeposit) || {}

  const { chainToken, chainDecimals } = useChainToken(Chains.Statemine) || {}
  const isContentHidden = state === 'Success' || state === 'Error' || state === 'InProgress'

  const areButtonsDisabled = state === 'AwaitingSign'

  useEffect(() => {
    if (state === ThirdStepState.Loading && createAssetTransaction && teleportTransaction) {
      if (displayTeleportContent) {
        setState(ThirdStepState.TeleportReady)
      } else {
        setState(ThirdStepState.CreateAssetReady)
      }
    }
  }, [createAssetTransaction, displayTeleportContent, teleportTransaction])

  useEffect(() => {
    if (teleportTransaction?.status === 'Success') {
      setState(ThirdStepState.TeleportDone)
    }

    if (teleportTransaction?.status === 'Error') {
      setState(ThirdStepState.Error)
      setStepBarVisible(false)
    }

    if (teleportTransaction?.status === 'InBlock') {
      setStepBarVisible(false)
      setState(ThirdStepState.InProgress)
    }
  }, [setStepBarVisible, teleportTransaction?.status])

  useEffect(() => {
    if (createAssetTransaction?.status === 'Success') {
      setState(ThirdStepState.Success)
      setStepBarVisible(false)
    }

    if (createAssetTransaction?.status === 'Error') {
      setState(ThirdStepState.Error)
      setStepBarVisible(false)
    }

    if (createAssetTransaction?.status === 'InBlock') {
      setStepBarVisible(false)
      setState(ThirdStepState.InProgress)
    }
  }, [createAssetTransaction?.status, setStepBarVisible])

  if (state === ThirdStepState.Loading || !ownerAddress || !createAssetTransaction || !teleportTransaction) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    setState(ThirdStepState.AwaitingSign)
    if (state === ThirdStepState.TeleportReady) {
      await teleportTransaction.tx()
    } else {
      await createAssetTransaction.tx()
    }
  }

  const createAssetTransactionNumber = displayTeleportContent ? 2 : 1
  const createAssetTransactionTitle = createAssetStepDetails?.title.replace(/{txNumber}/g, createAssetTransactionNumber.toString()) ?? ''
  const TELEPORT_TRANSACTION_NUMBER = 1

  return (
    <>
      {createAssetStepDetails && (
        <TransactionState
          status={createAssetTransaction.status}
          title={createAssetTransactionTitle}
          text={createAssetStepDetails.text}
          name={createAssetStepDetails.name}
          number={createAssetTransactionNumber}
          onClose={onNext}
        />
      )}
      {teleportStepDetails && (
        <TransactionState
          status={teleportTransaction.status}
          title={teleportStepDetails.title}
          text={teleportStepDetails.text}
          name={teleportStepDetails.name}
          number={TELEPORT_TRANSACTION_NUMBER}
          onClose={onNext}
        />
      )}
      {!isContentHidden && (
        <div data-testid='third-step-content'>
          <TransactionInfoBlock status='baseInfo'>
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
          {displayTeleportContent && (
            <TransactionInfoBlock name='Teleport' number={TELEPORT_TRANSACTION_NUMBER} status={mapToTransactionInfoBlockStatus(teleportTransaction.status)}>
              <InfoRow>
                <Label>Chain</Label>
                <Text size='XS' color='white' bold>Kusama</Text>
                <Text size='XS' color='white' bold>Statemine</Text>
              </InfoRow>
              <InfoRow>
                <Label>Teleport amount</Label>
                <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={teleportAmount}/>
              </InfoRow>
            </TransactionInfoBlock>
          )}
          <TransactionInfoBlock name='Asset Creation' number={createAssetTransactionNumber} status={mapToTransactionInfoBlockStatus(createAssetTransaction.status)}>
            <InfoRow>
              <Label>Chain</Label>
              <Text size='XS' color='white' bold>Statemine</Text>
            </InfoRow>
            <InfoRow>
              <Label>Deposit</Label>
              <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={createAssetDeposit}/>
            </InfoRow>
            <InfoRow>
              <Label>Statemine fee</Label>
              <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={transactionFee}/>
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
