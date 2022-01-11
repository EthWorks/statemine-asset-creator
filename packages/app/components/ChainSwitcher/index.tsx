import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { Arrow } from '../icons'
import { ChainSelectItem } from './ChainSelectItem'

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
      <Select chain={currentChain} >
        <StyledArrow direction='down' width='10' height='6' />
        <ChainSelectItem chain={currentChain} />
      </Select>
      <SelectDropdown>
        <ChainSelectItem chain={Chains.Polkadot} onClick={() => _onSelectItemClick(Chains.Polkadot)} />
        <ChainSelectItem chain={Chains.Kusama} onClick={() => _onSelectItemClick(Chains.Kusama)} />
      </SelectDropdown>
    </Popover.Root>
  )
}

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

const SelectDropdown = styled(Popover.Content)`
  overflow: hidden;
  width: 133px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.black};
  transform: translateY(4px);
  
  div {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[900]};
    }
  }
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
`
