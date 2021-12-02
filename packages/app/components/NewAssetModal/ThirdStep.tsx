import type { ModalStep } from './types'

import { useMemo } from 'react'
import styled from 'styled-components'

import { Chains, useActiveAccount, useApi, useTransaction } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalFooter } from './ModalFooter'

export function ThirdStep({ onNext, onBack }: ModalStep): JSX.Element {
  const { admin, issuer, freezer, assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { api } = useApi(Chains.Statemine)
  const { activeAccount } = useActiveAccount(Chains.Statemine)

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

  const { tx } = useTransaction(api?.tx.utility.batchAll, [txs], activeAccount?.toString()) || {}
  if (!api || !activeAccount || !tx) return <>Loading..</>

  const _onSubmit = async (): Promise<void> => {
    await tx()
    onNext()
  }

  return (
    <>
      <InfoContainer>
        <Label>Asset name</Label>
        <Text size='XS' color='white' bold>{assetName}</Text>
        <Label>Asset symbol</Label>
        <Text size='XS' color='white' bold>{assetSymbol}</Text>
        <Label>Asset decimals</Label>
        <Text size='XS' color='white' bold>{assetDecimals}</Text>
        <Label>Asset id</Label>
        <Text size='XS' color='white' bold>{assetId}</Text>
        <Label>Asset minimal balance</Label>
        <Text size='XS' color='white' bold>{minBalance}</Text>
      </InfoContainer>

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

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 100px auto;
  grid-column-gap: 40px;
  grid-row-gap: 4px;
  align-items: center;
  margin-bottom: 16px;
`
