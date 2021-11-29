import type { FC } from 'react'

import styled from 'styled-components'

import { Chains, useActiveAccounts, useBalances, useBestNumber } from 'use-substrate'

import { shortAddress } from '../formaters/formaters'
import FormatBalance from './FormatBalance'
import { FormatBlockNumber } from './FormatBlockNumber'
import {Text} from "./typography";

interface Props {
  onClick: () => void
}

export const ActiveAccountBar: FC<Props> = ({ onClick }) => {
  const { activeAccounts } = useActiveAccounts()
  const { freeBalance: kusamaFreeBalance } = useBalances(activeAccounts[Chains.Kusama]?.toString(), Chains.Kusama) || {}
  const { freeBalance: statemineFreeBalance } = useBalances(activeAccounts[Chains.Statemine]?.toString(), Chains.Statemine) || {}
  const kusamaBlockNumber = useBestNumber(Chains.Kusama)
  const statemineBlockNumber = useBestNumber(Chains.Statemine)
  const isKusamaAccountSet = !!activeAccounts[Chains.Kusama]

  return (
    <ActiveAccountWrapper
      data-testid="active-account-bar"
      onClick={onClick}
    >
      {isKusamaAccountSet && (
        <ActiveAccount>
          <div>
            <p>Kusama</p>
            <FormatBalance token={'KSM'} chainDecimals={12} value={kusamaFreeBalance}/>
            <p>
            Current block
              <FormatBlockNumber value={kusamaBlockNumber}/>
            </p>
          </div>
          <div>
            {activeAccounts[Chains.Kusama]?.toString()}
          </div>
        </ActiveAccount>
      )}
      <ActiveAccount>
        <div>
          <p>Statemine</p>
          <FormatBalance token={'KSM'} chainDecimals={12} value={statemineFreeBalance}/>
          <p>
            Current block
            <FormatBlockNumber value={statemineBlockNumber}/>
          </p>
        </div>
        <AddressWrapper>
          <AddressText size='XS'>
            {shortAddress(activeAccounts[Chains.Statemine]?.toString(), 8)}
          </AddressText>
        </AddressWrapper>
      </ActiveAccount>
    </ActiveAccountWrapper>
  )
}

const ActiveAccountWrapper = styled.div`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.l};
  background-color: ${({ theme }) => theme.colors.black};
`

const ActiveAccount = styled.div`
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.gray[800]};
`

const AddressWrapper = styled.div`
  padding-left: 8px;
  border-left: 1px solid ${({ theme }) => theme.colors.gray[600]};
`

const AddressText = styled(Text)`
  position: relative;
  padding-left: 12px;
  
  &:before {
    
  }
`