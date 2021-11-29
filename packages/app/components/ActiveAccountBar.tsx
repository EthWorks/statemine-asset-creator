import type { FC } from 'react'

import Image from 'next/image'
import styled from 'styled-components'

import { Chains, useActiveAccounts, useBalances, useBestNumber } from 'use-substrate'

import KusamaLogo from '../assets/img/kusama.png'
import StatemineLogo from '../assets/img/statemine.svg'
import { shortAddress } from '../formaters/formaters'
import { ButtonSquare } from './button/Button'
import { Edit } from './icons'
import { FormatBalance } from './FormatBalance'
import { FormatBlockNumber } from './FormatBlockNumber'
import { Text } from './typography'

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
    <ActiveAccountWrapper data-testid="active-account-bar">
      {isKusamaAccountSet && (
        <ActiveAccount>
          <ActiveAccountContent>
            <LogoWrapper>
              <Image src={KusamaLogo} alt='Kusama' />
            </LogoWrapper>
            <div>
              <ActiveAccountText size='XS'>
                Kusama,
                <FormatBalance token={'KSM'} chainDecimals={12} value={kusamaFreeBalance}/>
              </ActiveAccountText>
              <ActiveAccountText size='XXS'>
                Current block
                <FormatBlockNumber value={kusamaBlockNumber}/>
              </ActiveAccountText>
            </div>
          </ActiveAccountContent>
          <AddressWrapper>
            <AddressText size='XS'>
              {shortAddress(activeAccounts[Chains.Kusama]?.toString(), 8)}
            </AddressText>
          </AddressWrapper>
        </ActiveAccount>
      )}
      <ActiveAccount>
        <ActiveAccountContent>
          <LogoWrapper>
            <Image src={StatemineLogo} alt='Statemine' />
          </LogoWrapper>
          <div>
            <ActiveAccountText size='XS'>
              Statemine,
              <FormatBalance token={'KSM'} chainDecimals={12} value={statemineFreeBalance}/>
            </ActiveAccountText>
            <ActiveAccountText size='XXS'>
              Current block
              <FormatBlockNumber value={statemineBlockNumber}/>
            </ActiveAccountText>
          </div>
        </ActiveAccountContent>
        <AddressWrapper>
          <AddressText size='XS'>
            {shortAddress(activeAccounts[Chains.Statemine]?.toString(), 8)}
          </AddressText>
        </AddressWrapper>
      </ActiveAccount>
      <EditButton onClick={onClick}>
        <Edit />
      </EditButton>
    </ActiveAccountWrapper>
  )
}

const ActiveAccountWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto 24px;
  grid-column-gap: 8px;
  align-items: center;
  padding: 4px 8px 4px 4px;
  border-radius: ${({ theme }) => theme.borderRadius.l};
  background-color: ${({ theme }) => theme.colors.black};
`

const ActiveAccount = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  grid-column-gap: 8px;
  padding: 8px;
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
  
  p {
    margin-left: 4px;
  }
`

const EditButton = styled(ButtonSquare)`
  color: ${({ theme }) => theme.colors.gray[500]};
  
  &:hover {
    background: none;
  }
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
