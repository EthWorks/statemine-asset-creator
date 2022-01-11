import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { chainLogoPicker } from '../../formaters/chainLogoPicker'
import { Text } from '../typography'

interface ChainSelectItemProps {
  chain: Chains,
  className?: string,
  onClick?: () => void
}

export const ChainSelectItem = ({ chain, className, onClick }: ChainSelectItemProps): JSX.Element => (
  <SelectItem className={className} onClick={onClick}>
    <Image width='25' height='25' src={chainLogoPicker(chain)} alt={chain} />
    <div>
      <StyledText size='XXS' color={chain === Chains.Polkadot ? 'white' : undefined}>Network</StyledText>
      <StyledText size='XS' color='white'>{chain}</StyledText>
    </div>
  </SelectItem>
)

const SelectItem = styled.div`
  display: grid;
  grid-template-columns: 25px auto;
  grid-column-gap: 4px;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  cursor: pointer;
`

const StyledText = styled(Text)`
  text-transform: capitalize;
  text-align: left;
`
