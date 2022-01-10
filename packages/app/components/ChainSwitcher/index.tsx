import * as Popover from '@radix-ui/react-popover'
import Image from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import kusama from '../../assets/img/kusama.svg'
import polkadot from '../../assets/img/polkadot.svg'
import { Arrow } from '../icons'
import { Text } from '../typography'

interface SelectProps {
  isPolkadot: boolean
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
        <Select isPolkadot={currentChain === Chains.Polkadot} >
          <StyledArrow direction='down' width='10' height='6' />
          <SelectItem>
            <Image width='25' height='25' src={kusama} alt={currentChain} />
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
            <Image width='25' height='25' src={polkadot} alt='polkadot' />
            <div>
              <Text size='XXS'>Network</Text>
              <StyledText size='XS' color='white'>Polkadot</StyledText>
            </div>
          </SelectItem>
          <SelectItem onClick={() => _onSelectItemClick(Chains.Kusama)}>
            <Image width='25' height='25' src={kusama} alt='kusama' />
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
  background-color: ${({ theme, isPolkadot }) => isPolkadot ? theme.colors.pinkLight : theme.colors.black};
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
