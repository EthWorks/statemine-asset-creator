import type { ModalStep } from './types'

import { useCallback, useEffect, useState } from 'react'

import { Chains, TransactionStatus, useActiveAccount, useChainToken } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ChainIdentifier } from '../ChainIdentifier'
import { FeeSelect } from '../FeeSelect'
import { FormatBalance } from '../FormatBalance'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { InfoRow, TransactionInfoBlock } from '../TransactionInfoBlock/TransactionInfoBlock'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { TransactionState } from './TransactionState/TransactionState'
import { mapToTransactionInfoBlockStatus, useCreateAssetTransaction, useTeleport } from './helpers'
import { ModalFooter } from './ModalFooter'

interface StepBarProps {
  setStepBarVisible: (arg: boolean) => void
}

export function ThirdStep({ onNext, onBack, setStepBarVisible }: ModalStep & StepBarProps): JSX.Element {
  const { tx, status, stepDetails, transactionFee, createAssetDeposit } = useCreateAssetTransaction()
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()

  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}
  const { isTeleportRequired, teleportAmount } = useTeleport(ownerAddress?.toString(), transactionFee, createAssetDeposit) || {}

  const [isContentVisible, setIsContentVisible] = useState<boolean>(true)
  const { chainToken, chainDecimals } = useChainToken(Chains.Statemine) || {}

  const setSummaryVisible = useCallback((visible: boolean): void => {
    setIsContentVisible(visible)
    setStepBarVisible(visible)
  }, [setStepBarVisible])

  useEffect(() => {
    if (status === TransactionStatus.Ready || status === TransactionStatus.AwaitingSign) {
      setSummaryVisible(true)
    } else {
      setSummaryVisible(false)
    }
  }, [setSummaryVisible, status])

  if (!ownerAddress || !tx || !status) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    await tx()
  }

  const areButtonsDisabled = status !== TransactionStatus.Ready

  return (
    <>
      {stepDetails && (
        <TransactionState
          status={status}
          title={stepDetails.title}
          text={stepDetails.text}
          name={stepDetails.name}
          number={stepDetails.number}
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
          {isTeleportRequired && (
            <TransactionInfoBlock name='Teleport' number={1} status='ready'>
              <InfoRow>
                <Label>Chain</Label>
                <ChainIdentifier chainFrom='Kusama' chainTo='Statemine' />
              </InfoRow>
              <InfoRow>
                <Label>Teleport amount</Label>
                <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={teleportAmount}/>
              </InfoRow>
            </TransactionInfoBlock>
          )}
          <TransactionInfoBlock name='Asset Creation' number={isTeleportRequired ? 2 : 1} status={mapToTransactionInfoBlockStatus(status)}>
            <InfoRow>
              <Label>Chain</Label>
              <ChainIdentifier chainFrom='Statemine' />
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
