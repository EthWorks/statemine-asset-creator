import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

import pending from '../../../assets/coin.gif'
import complete from '../../../assets/complet.svg'
import fail from '../../../assets/fail.svg'
import { ButtonOutline, ButtonTertiary } from '../../button/Button'
import { ViewIcon } from '../../icons'
import { Text } from '../../typography'

export interface StatusStepProps {
  name?: string,
  number?: number,
  status: 'pending' | 'complete' | 'fail',
  title: string,
  text: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const renderIcon = (status:string) => {
  switch (status) {
    case 'pending': {
      return pending
    }
    case 'complete': {
      return complete
    }
    default: {
      return fail
    }
  }
}

export const StatusStep = ({ name, number, status, title, text }: StatusStepProps): JSX.Element => (
  <StatusStepWrapper>
    <CoinWrapper>
      <Image src={renderIcon(status)} alt='' width='120' height='120' />
    </CoinWrapper>
    <TitleText size='2XL' color='white' bold>{title}</TitleText>
    {status === 'pending' &&
      <TransactionWrapper>
        <Text size='SM'>Transaction #{number}</Text>
        <Text size='SM' color='white'>{name}</Text>
      </TransactionWrapper>
    }
    <StyledText size='SM'>{text}</StyledText>
    <ButtonWrapper>
      {status === 'complete'
        ? <>
          <ButtonOutline>
            View asset in explorer
            <ViewIcon width='20' height='20' />
          </ButtonOutline>
          <ButtonTertiary>Back to dashboard</ButtonTertiary>
        </>
        : status === 'fail' && <ButtonTertiary>Back to dashboard</ButtonTertiary>
      }
    </ButtonWrapper>
  </StatusStepWrapper>
)

const StatusStepWrapper = styled.div`
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
