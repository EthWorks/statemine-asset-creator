import type { ModalStep } from './types'

import BN from 'bn.js'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useActiveAccount, useBalances, useChainToken } from 'use-substrate'

import { useAppChains, useCapitalizedChains } from '../../utils'
import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ChainIdentifier } from '../ChainIdentifier'
import { FormatBalance } from '../FormatBalance'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { ThirdStepInfobox } from '../ThirdStepInfobox'
import { TransactionCostSummary } from '../TransactionCostSummary'
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

interface Props {
  openAccountSelectModal: () => void,
  setIsTransactionStateDisplayed: (arg: boolean) => void
}

const EMPTY_ROW: JSX.Element = <>-</>

export function ThirdStep({ onNext, onBack, setIsTransactionStateDisplayed, openAccountSelectModal }: ModalStep & Props): JSX.Element {
  const { parachain, relayChain } = useAppChains()
  const [capitalizedRelayChain, capitalizedParachain] = useCapitalizedChains([relayChain, parachain])
  const [state, setState] = useState<ThirdStepState>(ThirdStepState.Loading)
  const [displayTeleport, setDisplayTeleport] = useState(false)
  const { transaction: createAssetTransaction, stepDetails: createAssetStepDetails, createAssetDeposit } = useCreateAssetTransaction() || {}
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()

  const createAssetTransactionFee = createAssetTransaction?.paymentInfo?.partialFee
  const { activeAccount } = useActiveAccount(parachain)
  const { address: ownerAddress } = activeAccount || {}
  const { requireTeleport, teleportAmount, transaction: teleportTransaction, stepDetails: teleportStepDetails } = useTeleportTransaction(ownerAddress, createAssetTransactionFee, createAssetDeposit) || {}

  const teleportTransactionFee = teleportTransaction?.paymentInfo?.partialFee

  const { activeAccount: relayChainActiveAccount } = useActiveAccount(relayChain)
  const { availableBalance: relayChainAvailableBalance } = useBalances(relayChainActiveAccount?.address.toString(), relayChain) || {}

  const { chainToken, chainDecimals } = useChainToken(parachain) || {}
  const isContentHidden = state === 'Success' || state === 'Error' || state === 'InProgress'
  const hasRelayChainFunds = useMemo(() => teleportAmount && relayChainAvailableBalance?.gt(teleportAmount), [relayChainAvailableBalance, teleportAmount])
  const areButtonsDisabled = state === 'AwaitingSign'

  useEffect(() => {
    if (state === ThirdStepState.Loading && createAssetTransaction && teleportTransaction) {
      if (requireTeleport) {
        setDisplayTeleport(true)
        setState(ThirdStepState.TeleportReady)
      } else {
        setState(ThirdStepState.CreateAssetReady)
      }
    }
  }, [createAssetTransaction, requireTeleport, teleportTransaction])

  useEffect(() => {
    if (teleportTransaction?.status === 'Success') {
      setIsTransactionStateDisplayed(false)
      setState(ThirdStepState.TeleportDone)
    }

    if (teleportTransaction?.status === 'Error') {
      setIsTransactionStateDisplayed(true)
      setState(ThirdStepState.Error)
    }

    if (teleportTransaction?.status === 'InBlock') {
      setIsTransactionStateDisplayed(true)
      setState(ThirdStepState.InProgress)
    }
  }, [setIsTransactionStateDisplayed, teleportTransaction?.status])

  useEffect(() => {
    if (createAssetTransaction?.status === 'Success') {
      setIsTransactionStateDisplayed(true)
      setState(ThirdStepState.Success)
    }

    if (createAssetTransaction?.status === 'Error') {
      setIsTransactionStateDisplayed(true)
      setState(ThirdStepState.Error)
    }

    if (createAssetTransaction?.status === 'InBlock') {
      setIsTransactionStateDisplayed(true)
      setState(ThirdStepState.InProgress)
    }
  }, [createAssetTransaction?.status, setIsTransactionStateDisplayed])

  const totalFee = useMemo(() => displayTeleport && teleportTransactionFee
    ? createAssetTransactionFee?.add(teleportTransactionFee)
    : createAssetTransactionFee,
  [createAssetTransactionFee, displayTeleport, teleportTransactionFee])

  const createAssetTransactionNumber = displayTeleport ? 2 : 1
  const createAssetTransactionTitle = useMemo(() => createAssetStepDetails?.title.replace(/{txNumber}/g, createAssetTransactionNumber.toString()), [createAssetStepDetails?.title, createAssetTransactionNumber])
  const TELEPORT_TRANSACTION_NUMBER = 1
  const formattedMinBalance = useMemo(() => new BN(minBalance), [minBalance])
  if (state === ThirdStepState.Loading || !ownerAddress || !createAssetTransaction || !teleportTransaction) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    setState(ThirdStepState.AwaitingSign)
    if (state === ThirdStepState.TeleportReady) {
      await teleportTransaction.tx()
    } else {
      await createAssetTransaction.tx()
    }
  }

  return (
    <>
      {createAssetStepDetails && (
        <TransactionState
          status={createAssetTransaction.status}
          title={createAssetTransactionTitle ?? ''}
          text={createAssetStepDetails.text}
          name={createAssetStepDetails.name}
          number={createAssetTransactionNumber}
          onClose={onNext}
          assetId={assetId}
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
          {state === ThirdStepState.TeleportReady && (
            <ThirdStepInfobox
              openAccountSelectModal={openAccountSelectModal}
              hasRelayChainFunds={!!hasRelayChainFunds}
              relayChainActiveAccount={relayChainActiveAccount}
            />
          )}
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
              <StyledFormatBalance chainDecimals={+assetDecimals} token={assetSymbol} value={formattedMinBalance}/>
            </InfoRow>
            <InfoRow>
              <Label>Asset id</Label>
              <Text size='XS' color='white' bold>{assetId}</Text>
            </InfoRow>
          </TransactionInfoBlock>
          {displayTeleport && (
            <TransactionInfoBlock name='Teleport' number={TELEPORT_TRANSACTION_NUMBER} status={mapToTransactionInfoBlockStatus(teleportTransaction.status)}>
              <InfoRow>
                <Label>Chain</Label>
                <ChainIdentifier chainMain={relayChain} chainTo={parachain}/>
              </InfoRow>
              <InfoRow>
                <Label>Teleport amount</Label>
                <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={teleportAmount}/>
              </InfoRow>
              <InfoRow>
                <Label>{capitalizedRelayChain} fee</Label>
                {teleportTransactionFee
                  ? <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={teleportTransactionFee}/>
                  : EMPTY_ROW
                }
              </InfoRow>
            </TransactionInfoBlock>
          )}
          <TransactionInfoBlock
            name='Asset Creation'
            number={createAssetTransactionNumber}
            status={mapToTransactionInfoBlockStatus(createAssetTransaction.status)}
          >
            <InfoRow>
              <Label>Chain</Label>
              <ChainIdentifier chainMain={parachain}/>
            </InfoRow>
            <InfoRow>
              <Label>Deposit</Label>
              <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={createAssetDeposit}/>
            </InfoRow>
            <InfoRow>
              <Label>{capitalizedParachain} fee</Label>
              <FormatBalance chainDecimals={chainDecimals} token={chainToken} value={createAssetTransactionFee}/>
            </InfoRow>
          </TransactionInfoBlock>
          {chainDecimals && chainToken && totalFee && teleportAmount && (
            <TransactionCostSummary
              decimals={chainDecimals}
              token={chainToken}
              totalAmount={teleportAmount.add(totalFee)}
              totalFee={totalFee}
            />
          )}
          <ModalFooter contentPosition='between'>
            <ButtonOutline onClick={onBack} disabled={areButtonsDisabled}>
              <ArrowLeft/>
              Back
            </ButtonOutline>
            <ButtonPrimary onClick={_onSubmit} disabled={areButtonsDisabled || !hasRelayChainFunds}>
              Confirm
              <ArrowRight/>
            </ButtonPrimary>
          </ModalFooter>
        </div>
      )}
    </>
  )
}

const StyledFormatBalance = styled(FormatBalance)`
  p {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
  }
`
