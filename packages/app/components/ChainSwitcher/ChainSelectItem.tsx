import React from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { ColorType } from '../../styles/styleVariables'
import { ChainLogo } from '../ChainLogo'
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

const _pickColors = (chain: Chains): { backgroundColor: string, networkColor?: ColorType, chainColor?: ColorType } => {
  switch (chain) {
    case Chains.Polkadot:
      return { backgroundColor: '#E6007A', networkColor: 'gray50' }
    case Chains.Westend:
      return { backgroundColor: '#FFFFFF', networkColor: 'gray900', chainColor: 'gray900' }
    default:
      return { backgroundColor: '#000000' }
  }
}

export const ChainSelectItem = ({ chain, className, onClick, isTrigger }: ChainSelectItemProps): JSX.Element => {
  const { backgroundColor, networkColor, chainColor } = _pickColors(chain)

  return (
    <SelectItem className={className} onClick={onClick} backgroundColor={backgroundColor} isTrigger={isTrigger}>
      <ChainLogo chain={chain}/>
      <div>
        {isTrigger && <StyledText size='XXS' color={networkColor}>Network</StyledText>}
        <StyledText size='XS' color={(isTrigger && chainColor) ? chainColor : 'white'}>{chain}</StyledText>
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
