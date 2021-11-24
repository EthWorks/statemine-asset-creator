import type { ModalStep } from './types'

import styled from 'styled-components'

import { Chains, useActiveAccount, useApi, useTransaction } from 'use-substrate'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { Arrow } from '../icons/Arrow'
import { ModalFooter } from '../Modal/ModalFooter'
import { Label, Text } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'

export function SecondStep({ onNext }: ModalStep): JSX.Element {
  const { assetName, assetSymbol, assetDecimals, assetId, minBalance } = useNewAssetModal()
  const { api } = useApi(Chains.Statemine)
  const { activeAccount } = useActiveAccount()

  const txs = activeAccount ? [
    api?.tx.assets.create(assetId, activeAccount.toString(), minBalance),
    api?.tx.assets.setMetadata(assetId, assetName, assetSymbol, assetDecimals)
  ] : []

  const { tx } = useTransaction(api?.tx.utility.batch, [txs], activeAccount?.toString()) || {}

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
        <ButtonOutline>
          <Arrow direction='left' width='14' height='9' />
          Back
        </ButtonOutline>
        <ButtonPrimary onClick={_onSubmit}>
          Confirm
          <Arrow direction='right' width='14' height='9' />
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
