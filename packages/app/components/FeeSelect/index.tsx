import type { Balance } from '@polkadot/types/interfaces'

import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react'
import styled from 'styled-components'

import { useBalances } from 'use-substrate'

import { useAppChains } from '../../utils'
import { Arrow } from '../icons'
import { FeeRow } from './FeeRow'

export interface FeeSelectProps {
  account: string,
}

interface FeeSelectItem {
  balance: Balance | undefined;
  token: string;
  decimals: number;
}

const DECIMALS = 10
const TOKEN = 'KSM'

export const FeeSelect = ({ account }: FeeSelectProps): JSX.Element => {
  const { paraChain } = useAppChains()
  const [isOpen, setOpen] = useState(false)
  const { availableBalance } = useBalances(account, paraChain) || {}
  const selectItems: FeeSelectItem[] = [{ balance: availableBalance, token: TOKEN, decimals: DECIMALS }]
  const [currentFeeIndex, setCurrentFeeIndex] = useState<number>(0)

  const selected = selectItems[currentFeeIndex]

  const handleClick = (index: number): void => {
    setCurrentFeeIndex(index)
    setOpen(false)
  }

  return (
    <div>
      <Popover.Root onOpenChange={setOpen} open={isOpen}>
        <Select>
          <FeeRow balance={selected.balance} decimals={selected.decimals} token={selected.token} />
          <StyledArrow width='10' height='6' direction='down'/>
        </Select>
        <Dropdown>
          <ul>
            {selectItems.map(({ balance, token, decimals }, index) => (
              <li key={index} onClick={() => handleClick(index)}>
                <FeeRow balance={balance} decimals={decimals} token={token} />
              </li>
            ))}
          </ul>
        </Dropdown>
      </Popover.Root>
    </div>
  )
}

const Select = styled(Popover.Trigger)`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  width: 636px;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.black};
  text-align: left;
  cursor: pointer;
  
  p {
    white-space: nowrap;
  }
  
  svg {
    color: ${({ theme }) => theme.colors.gray[500]};
    margin-left: 16px;
  }
`

const Dropdown = styled(Popover.Content)`
  overflow: hidden;
  padding: 0;
  width: 636px;
  transform: translateY(2px);
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.gray[700]};
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      cursor: pointer;
      padding: 4px 8px;
      
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray[600]};
      }
      
      & + li {
        margin-top: 4px;
      }
    }
  }
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
`
