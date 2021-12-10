import type { StaticImageData } from '../types'

import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

import { TransactionStatus } from 'use-substrate'

import pending from '../../../assets/coin.gif'
import complete from '../../../assets/complet.svg'
import fail from '../../../assets/fail.svg'
import { ButtonOutline, ButtonTertiary } from '../../button/Button'
import { ViewIcon } from '../../icons'
import { Text } from '../../typography'

export interface TransactionStateProps {
  name?: string,
  number?: number,
  status: TransactionStatus | undefined,
  title: string,
  text: string
}

const getIcon = (status: TransactionStatus): StaticImageData => {
  switch (status) {
    case TransactionStatus.InBlock: {
      return pending
    }
    case TransactionStatus.Success: {
      return complete
    }
    default: {
      return fail
    }
  }
}

export const TransactionState = ({ name, number, status, title, text }: TransactionStateProps): JSX.Element | null => {
  if (!status || status === TransactionStatus.Ready || status === TransactionStatus.AwaitingSign) return null

  return (
    <TransactionStateWrapper data-testid={`status-step-${status}`}>
      <CoinWrapper>
        <Image src={getIcon(status)} alt='' width='120' height='120'/>
      </CoinWrapper>
      <TitleText size='2XL' color='white' bold>{title}</TitleText>
      {status === TransactionStatus.InBlock &&
      <TransactionWrapper>
        <Text size='SM'>Transaction #{number}</Text>
        <Text size='SM' color='white'>{name}</Text>
      </TransactionWrapper>
      }
      <StyledText size='SM'>{text}</StyledText>
      <ButtonWrapper>
        {status === TransactionStatus.Success
          ? <>
            <ButtonOutline>
            View asset in explorer
              <ViewIcon width='20' height='20' />
            </ButtonOutline>
            <ButtonTertiary>Back to dashboard</ButtonTertiary>
          </>
          : status === TransactionStatus.Error && <ButtonTertiary>Back to dashboard</ButtonTertiary>
        }
      </ButtonWrapper>
    </TransactionStateWrapper>

  )
}

const TransactionStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CoinWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
`

const TransactionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  p:first-child {
    position: relative;
    color: ${({ theme }) => theme.colors.gray[500]};
    padding-right: 8px;
    margin-right: 8px;
    
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      border-radius: ${({ theme }) => theme.borderRadius.circle};
      background-color: ${({ theme }) => theme.colors.gray[500]};
    }
  }
`

const StyledText = styled(Text)`
  text-align: center;
`

const ButtonWrapper = styled.div`
  margin-top: 24px;

  button + button {
    margin-top: 24px;
  }
`

const TitleText = styled(Text)`
  margin-bottom: 24px;
`
