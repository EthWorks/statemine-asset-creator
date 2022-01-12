import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { chainLogoPicker } from '../../formaters/chainLogoPicker'
import { ColorType } from '../../styles/styleVariables'
import { Text } from '../typography'

interface ChainSelectItemProps {
  chain: Chains,
  className?: string,
  onClick?: () => void,
  isTrigger?: boolean
}

interface SelectItemProps {
  backgroundColor: string,
  isTrigger?: boolean
}

type DefaultTextColor = undefined

const _pickColors = (chain: Chains): {backgroundColor: string, color: ColorType | DefaultTextColor} => {
  switch (chain) {
    case Chains.Polkadot:
      return { backgroundColor: '#E6007A', color: 'white' }
    default:
      return { backgroundColor: '#000000', color: undefined }
  }
}

export const ChainSelectItem = ({ chain, className, onClick, isTrigger }: ChainSelectItemProps): JSX.Element => {
  const { backgroundColor, color } = _pickColors(chain)

  return (
    <SelectItem className={className} onClick={onClick} backgroundColor={backgroundColor} isTrigger={isTrigger}>
      <Image width='25' height='25' src={chainLogoPicker(chain)} alt={chain} />
      <div>
        <StyledText size='XXS' color={isTrigger ? color : undefined}>Network</StyledText>
        <StyledText size='XS' color='white'>{chain}</StyledText>
      </div>
    </SelectItem>
  )
}

const SelectItem = styled.div<SelectItemProps>`
  background-color: ${({ backgroundColor, isTrigger }) => isTrigger ? backgroundColor : '#000000'};
  display: grid;
  grid-template-columns: 25px auto;
  grid-column-gap: 4px;
  align-items: center;
  border-radius: ${({ isTrigger }) => isTrigger ? '8px' : '0px'};
  width: 100%;
  height: 100%;
  padding: 8px;
  cursor: pointer;
`

const StyledText = styled(Text)`
  text-transform: capitalize;
  text-align: left;
`
