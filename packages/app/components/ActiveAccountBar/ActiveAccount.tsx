import Image from 'next/image'
import { FC } from 'react'
import styled from 'styled-components'

import { Chains, useActiveAccount, useBalances, useBestNumber } from 'use-substrate'

import { shortAddress } from '../../formaters/formaters'
import { FormatBalance } from '../FormatBalance'
import { FormatBlockNumber } from '../FormatBlockNumber'
import { Text } from '../typography'

interface ActiveAccountProps {
  logo?: string,
  chain: Chains
}

export const ActiveAccount: FC<ActiveAccountProps> = ({ chain, logo }) => {
  const { activeAccount } = useActiveAccount(chain)
  const { freeBalance: chainFreeBalance } = useBalances(activeAccount?.address.toString(), chain) || {}
  const chainBlockNumber = useBestNumber(chain)

  if (!activeAccount) return null

  return (
    <ActiveAccountWrapper>
      <ActiveAccountContent>
        <LogoWrapper>
          {logo && <Image src={logo} alt={chain}/>}
        </LogoWrapper>
        <div>
          <InfoWrapper>
            <ActiveAccountText size='XS'>{chain},</ActiveAccountText>
            <StyledFormatBalance token={'KSM'} chainDecimals={12} value={chainFreeBalance}/>
          </InfoWrapper>
          <InfoWrapper>
            <ActiveAccountText size='XXS'>Current block</ActiveAccountText>
            <FormatBlockNumber value={chainBlockNumber}/>
          </InfoWrapper>
        </div>
      </ActiveAccountContent>
      <AddressWrapper>
        <AddressText size='XS'>
          {activeAccount.address ? shortAddress(activeAccount.address.toString(), 8) : ''}
        </AddressText>
      </AddressWrapper>
    </ActiveAccountWrapper>
  )
}
const ActiveAccountWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  grid-column-gap: 8px;
  height: 44px;
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.gray[800]};
`

const ActiveAccountContent = styled.div`
  display: flex;
  align-items: center;
`

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  border-left: 1px solid ${({ theme }) => theme.colors.gray[600]};
`

const AddressText = styled(Text)`
  position: relative;
  padding-left: 12px;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    background-color: ${({ theme }) => theme.colors.green};
  }
`

const ActiveAccountText = styled(Text)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-transform: capitalize;
  margin-right: 4px;
`

const LogoWrapper = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const InfoWrapper = styled.div`
  display: flex;
`

const StyledFormatBalance = styled(FormatBalance)`
  p {
    font-size: 12px;
  }
`
