import { Balance } from '@polkadot/types/interfaces'
import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react'
import styled from 'styled-components'

import { Chains, useBalances } from 'use-substrate'

import { FormatBalance } from '../FormatBalance'
import { Arrow } from '../icons'
import { Text } from '../typography'

export interface FeeSelectProps {
  account: string,
  balance?: string,
  symbol: string
}

interface FeeSelectItem {
  balance: Balance | undefined;
  token: string;
  decimals: number;
}

const DECIMALS = 10
const TOKEN = 'KSM'

export const FeeSelect = ({ account }: FeeSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const { availableBalance } = useBalances(account, Chains.Statemine) || {}
  const feeArr: FeeSelectItem[] = [{ balance: availableBalance, token: TOKEN, decimals: DECIMALS }]
  const [currentFeeIndex, setCurrentFeeIndex] = useState<number>(0)

  const selected = feeArr[currentFeeIndex]

  const handleClick = (index: number): void => {
    setCurrentFeeIndex(index)
    setOpen(false)
  }

  return (
    <div>
      <Popover.Root onOpenChange={setOpen} open={isOpen}>
        <Select>
          <FeeRow>
            <FeeSymbol size='SM' color='white'>{selected.token}</FeeSymbol>
            <StyledText size='XS'>BALANCE</StyledText>
            <StyledFormatBalance chainDecimals={selected.decimals} token={selected.token} value={selected.balance} />
          </FeeRow>
          <StyledArrow width='10' height='6' direction='down'/>
        </Select>
        <Dropdown>
          <ul>
            {feeArr.map(({ balance, token, decimals }, index) => (
              <li key={index} onClick={() => handleClick(index)}>
                <FeeRow>
                  <FeeSymbol size='SM' color='white'>{token}</FeeSymbol>
                  <StyledText size='XS'>BALANCE</StyledText>
                  <StyledFormatBalance chainDecimals={decimals} token={token} value={balance} />
                </FeeRow>
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

const FeeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 0.7fr;
  grid-column-gap: 12px;
  align-items: center;
  padding-right: 26px;
  width: 100%;
`

const FeeSymbol = styled(Text)`
  margin-right: auto;
`

const StyledFormatBalance = styled(FormatBalance)`
  justify-content: flex-end;
  
  p {
    text-align: right;
  }
`

const StyledText = styled(Text)`
  text-align: right;
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
`
