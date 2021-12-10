import type { ModalStep } from './types'

import { useMemo } from 'react'

import { Chains, useActiveAccount, useApi, useTransaction } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { FeeSelect } from '../FeeSelect'
import { ArrowLeft, ArrowRight } from '../icons'
import { Loader } from '../Loader'
import { InfoRow, TransactionInfoBlock } from '../TransactionInfoBlock/TransactionInfoBlock'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalFooter } from './ModalFooter'

export function ThirdStep({ onNext, onBack }: ModalStep): JSX.Element {
  const { admin, issuer, freezer, assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { api } = useApi(Chains.Statemine)
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address: ownerAddress } = activeAccount || {}

  const txs = useMemo(() => admin && issuer && freezer
    ? admin.address === issuer.address && admin.address === freezer.address
      ? [
        api?.tx.assets.create(assetId, admin.address, minBalance),
        api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals)
      ]
      : [
        api?.tx.assets.create(assetId, admin.address, minBalance),
        api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals),
        api?.tx.assets.setTeam(assetId, issuer.address, admin.address, freezer.address)
      ]
    : [], [admin, issuer, freezer, api, assetDecimals, assetId, assetName, assetSymbol, minBalance])

  const { tx } = useTransaction(api?.tx.utility.batchAll, [txs], ownerAddress?.toString()) || {}

  if (!api || !ownerAddress || !tx) return <Loader/>

  const _onSubmit = async (): Promise<void> => {
    await tx()
    onNext()
  }

  return (
    <>
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
      <FeeSelect symbol='KSM' account={ownerAddress.toString()}/>

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
    </>
  )
}
