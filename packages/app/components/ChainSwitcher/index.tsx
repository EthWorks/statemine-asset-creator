import * as Popover from '@radix-ui/react-popover'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { useAppChains } from '../../utils'
import { Arrow } from '../icons'
import { ChainSelectItem } from './ChainSelectItem'

export const ChainSwitcher = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const { relayChain, setParachain, setRelayChain } = useAppChains()

  const _onSelectItemClick = useCallback((relayChain: Chains, parachain: Chains): void => {
    setRelayChain(relayChain)
    setParachain(parachain)
    setOpen(false)
  }, [setRelayChain, setParachain])

  const _switchToPolkadot = useCallback(() => _onSelectItemClick(Chains.Polkadot, Chains.Statemint), [_onSelectItemClick])
  const _switchToKusama = useCallback(() => _onSelectItemClick(Chains.Kusama, Chains.Statemine), [_onSelectItemClick])
  const _switchToWestend = useCallback(() => _onSelectItemClick(Chains.Westend, Chains.Westmint), [_onSelectItemClick])

  return (
    <Popover.Root onOpenChange={setOpen} open={isOpen}>
      <Select>
        <StyledArrow direction={isOpen ? 'up' : 'down'} width='10' height='6'/>
        <ChainSelectItem chain={relayChain} isTrigger/>
      </Select>
      <SelectDropdown>
        <ChainSelectItem chain={Chains.Polkadot} onClick={_switchToPolkadot}/>
        <ChainSelectItem chain={Chains.Kusama} onClick={_switchToKusama}/>
        <ChainSelectItem chain={Chains.Westend} onClick={_switchToWestend}/>
      </SelectDropdown>
    </Popover.Root>
  )
}

const Select = styled(Popover.Trigger)`
  position: relative;
  display: flex;
  align-items: center;
  width: 133px;
  height: 52px;
  padding: 0;
  border: none;
  border-radius: 8px;
  color: white;
`

const SelectDropdown = styled(Popover.Content)`
  overflow: hidden;
  width: 133px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.black};
  transform: translateY(4px);
  
  div:hover {
    background-color: ${({ theme }) => theme.colors.gray[900]};
  }
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
`
