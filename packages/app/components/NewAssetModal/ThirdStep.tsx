import type { ModalStep } from './types'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Chains, useActiveAccount, useChainToken } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { FeeSelect } from '../FeeSelect'
import { FormatBalance } from '../FormatBalance'
import { ArrowLeft, ArrowRight } from '../icons'
import { Info } from '../Info'
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
interface Props {
  openAccountSelectModal: () => void,
  setStepBarVisible: (arg: boolean) => void
}

export function ThirdStep({ onNext, onBack, setStepBarVisible }: ModalStep & StepBarProps): JSX.Element {
  const [state, setState] = useState<ThirdStepState>(ThirdStepState.Loading)
  const { transaction: createAssetTransaction, stepDetails: createAssetStepDetails, createAssetDeposit } = useCreateAssetTransaction() || {}
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { activeAccount: kusamaActiveAccount } = useActiveAccount(Chains.Kusama)

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

  const requiredTeleportInfo = (
    <StyledInfo
      text='Insufficient funds on the owner account to create the asset. Teleport transaction from selected Kusama account will be executed'
    />
  )

  const noKusamaAccountWarning = (
    <StyledInfo
      text='Insufficient funds on the owner account to create the asset. Cannot execute teleport transaction due to not selected Kusama account.'
      type='warning'
      action={{
        name: 'Select Kusama account',
        onClick: openAccountSelectModal
      }}
    />
  )

  return (
    <>
      {createAssetStepDetails && (
        <TransactionState
          status={createAssetTransaction.status}
          title={createAssetStepDetails.title}
          text={createAssetStepDetails.text}
          name={createAssetStepDetails.name}
          number={createAssetStepDetails.number}
          onClose={onNext}
        />
      )}
      {teleportStepDetails && (
        <TransactionState
          status={teleportTransaction.status}
          title={teleportStepDetails.title}
          text={teleportStepDetails.text}
          name={teleportStepDetails.name}
          number={teleportStepDetails.number}
          onClose={onNext}
        />
      )}
      {!isContentHidden && (
        <div data-testid='third-step-content'>
          {displayTeleportContent && teleport.status === TransactionStatus.Ready && (kusamaActiveAccount
            ? requiredTeleportInfo
            : noKusamaAccountWarning)
          }
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
            <TransactionInfoBlock name='Teleport' number={1} status={mapToTransactionInfoBlockStatus(teleportTransaction.status)}>
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
          <TransactionInfoBlock name='Asset Creation' number={displayTeleportContent ? 2 : 1} status={mapToTransactionInfoBlockStatus(createAssetTransaction.status)}>
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

          <FeeSelect account={ownerAddress.toString()}/>

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

const StyledInfo = styled(Info)`
  margin-bottom: 16px;
`
