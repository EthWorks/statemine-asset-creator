import * as Popover from '@radix-ui/react-popover'
import Image from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { chainLogoPicker } from '../../formaters/chainLogoPicker'
import { Arrow } from '../icons'
import { Text } from '../typography'

interface SelectProps {
  chain: Chains
}

const _pickColor = (chain: Chains): string => {
  switch (chain) {
    case Chains.Polkadot:
      return '#E6007A'
    default:
      return '#000000'
  }
}

export const ChainSwitcher = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const [currentChain, setCurrentChain] = useState(Chains.Kusama)

  const _onSelectItemClick = (chain: Chains): void => {
    setCurrentChain(chain)
    setOpen(false)
  }

  return (
    <Popover.Root onOpenChange={setOpen} open={isOpen}>
      <SelectWrapper>
        <Select chain={currentChain} >
          <StyledArrow direction='down' width='10' height='6' />
          <SelectItem>
            <Image width='25' height='25' src={chainLogoPicker(currentChain)} alt={currentChain} />
            <div>
              {currentChain === Chains.Polkadot
                ? <StyledText size='XXS' color='white'>Network</StyledText>
                : <StyledText size='XXS'>Network</StyledText>
              }
              <StyledText size='XS' color='white'>{currentChain}</StyledText>
            </div>
          </SelectItem>
        </Select>
        <Popover.Anchor />
        <SelectDropdown>
          <SelectItem onClick={() => _onSelectItemClick(Chains.Polkadot)}>
            <Image width='25' height='25' src={chainLogoPicker(Chains.Polkadot)} alt='polkadot' />
            <div>
              <Text size='XXS'>Network</Text>
              <StyledText size='XS' color='white'>Polkadot</StyledText>
            </div>
          </SelectItem>
          <SelectItem onClick={() => _onSelectItemClick(Chains.Kusama)}>
            <Image width='25' height='25' src={chainLogoPicker(Chains.Kusama)} alt='kusama' />
            <div>
              <Text size='XXS'>Network</Text>
              <StyledText size='XS' color='white'>Kusama</StyledText>
            </div>
          </SelectItem>
        </SelectDropdown>
      </SelectWrapper>
    </Popover.Root>
  )
}

const SelectWrapper = styled.div`
  position: relative;
  width: fit-content;
`

const Select = styled(Popover.Trigger)<SelectProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 133px;
  height: 52px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background-color: ${({ chain }) => _pickColor(chain)};
  color: white;
`

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

const SelectDropdown = styled(Popover.Content)`
  overflow: hidden;
  width: 133px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.black};
  transform: translateY(4px);
  
  ${SelectItem} {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[900]};
    }
  }
`

const StyledText = styled(Text)`
  text-transform: capitalize;
  text-align: left;
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
`
