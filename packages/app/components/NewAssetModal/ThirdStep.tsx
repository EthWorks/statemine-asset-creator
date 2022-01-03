import type { ModalStep } from './types'

import { useCallback, useEffect, useState } from 'react'

import { Chains, TransactionStatus, useActiveAccount, useChainToken } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { FeeSelect } from '../FeeSelect'
import { FormatBalance } from '../FormatBalance'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { InfoRow, TransactionInfoBlock } from '../TransactionInfoBlock/TransactionInfoBlock'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { TransactionState } from './TransactionState/TransactionState'
import { mapToTransactionInfoBlockStatus, useCreateAssetTransaction, useTeleportTransaction } from './helpers'
import { ModalFooter } from './ModalFooter'

interface StepBarProps {
  setStepBarVisible: (arg: boolean) => void
}

function wasTransactionSent(transaction: TransactionStatus | undefined, ignoreSuccess?: boolean): boolean {
  return transaction === TransactionStatus.Error ||
      transaction === TransactionStatus.InBlock ||
      (!ignoreSuccess && transaction === TransactionStatus.Success)
}

export function ThirdStep({ onNext, onBack, setStepBarVisible }: ModalStep & StepBarProps): JSX.Element {
  const { transaction: createAssetTransaction, stepDetails: createAssetStepDetails, createAssetDeposit } = useCreateAssetTransaction() || {}
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()

  const transactionFee = createAssetTransaction?.paymentInfo?.partialFee
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}
  const { displayTeleportContent, teleportAmount, transaction: teleportTransaction, stepDetails: teleportStepDetails } = useTeleportTransaction(ownerAddress, transactionFee, createAssetDeposit) || {}

  const [isContentVisible, setIsContentVisible] = useState<boolean>(true)
  const { chainToken, chainDecimals } = useChainToken(Chains.Statemine) || {}

  const setSummaryVisible = useCallback((visible: boolean): void => {
    setIsContentVisible(visible)
    setStepBarVisible(visible)
  }, [setStepBarVisible])

  useEffect(() => {
    if (wasTransactionSent(createAssetTransaction?.status) || wasTransactionSent(teleportTransaction?.status, true)) {
      setSummaryVisible(false)
    } else {
      setSummaryVisible(true)
    }
  }, [setSummaryVisible, createAssetTransaction?.status, teleportTransaction?.status])

  if (!ownerAddress || !createAssetTransaction || !teleportTransaction) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    if (displayTeleportContent && teleportTransaction.status === TransactionStatus.Ready) {
      await teleportTransaction.tx()
    } else {
      await createAssetTransaction.tx()
    }
  }

  const areButtonsDisabled = createAssetTransaction.status !== TransactionStatus.Ready ||
       teleportTransaction.status === TransactionStatus.InBlock

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
      {isContentVisible && (
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
