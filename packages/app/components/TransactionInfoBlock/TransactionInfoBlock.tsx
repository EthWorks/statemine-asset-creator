import { ReactNode } from 'react'
import styled from 'styled-components'

import { CheckIcon } from '../icons'
import { Text } from '../typography'

export interface TransactionInfoBlockProps {
  children: ReactNode,
  name?: string,
  number?: number,
  status?: 'waiting' | 'sign' | 'done'
}

export const TransactionInfoBlock = ({ children, name, number, status }: TransactionInfoBlockProps): JSX.Element => (
  <BlockWrapper className={status}>
    {name &&
      <BlockHeader className={status}>
        <BlockHeaderLine className={status}/>
        <BlockHeaderLine className={status}/>
        <TitleWrapper>
          {status === 'sign' && <SignText size='SM'>Sign</SignText>}
          <StyledText size='SM'>Transaction #{number}</StyledText>
          <Text size='SM' color='white'>{name}</Text>
          {status === 'done' &&
            <CheckWrapper>
              <CheckIcon width='14' height='14'/>
            </CheckWrapper>
          }
        </TitleWrapper>
      </BlockHeader>
    }
    {status !== 'done' && <InfoContainer>{children}</InfoContainer>}
  </BlockWrapper>
)

const BlockWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  
  &.waiting {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${({ theme }) => theme.colors.black};
      opacity: 0.7;
      z-index: 5;
    }
  }
`

const BlockHeader = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  
  &.sign {
    p {
      color: ${({ theme }) => theme.colors.pinkDark};
      
      &:before {
        background-color: ${({ theme }) => theme.colors.pinkDark};
      }
    }
  }
`

const BlockHeaderLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 1px;
  width: 50%;
  background-color: ${({ theme }) => theme.colors.gray[600]};
  
  & + & {
    left: 50%;
  }

  &:after,
  &:before {
    display: none;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 25%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.pinkDark};
    transform: translateX(0);
  }
  
  &:before {
    width: 50%;
    background-color: ${({ theme }) => theme.colors.pinkLight};
  }
  
  &.sign {
    background-color: #f9bfde;

    &:before {
      display: block;
      animation: sign 1.2s linear infinite;
    }

    &:after {
      display: block;
      animation-delay: 0.2s;
      z-index: 1;
      animation: sign 1s linear infinite;
    }
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: ${({ theme }) => theme.colors.black};
  z-index: 1;
`

const StyledText = styled(Text)`
  position: relative;
  color: ${({ theme }) => theme.colors.gray[500]};
  padding-right: 12px;
  margin-right: 8px;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.gray[500]};
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    z-index: 1;
  }
`

const SignText = styled(Text)`
  margin-right: 4px;
`

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 40px;
  grid-row-gap: 4px;
`

const CheckWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.green};
  border: 1px solid ${({ theme }) => theme.colors.green};
  border-radius: ${({ theme }) => theme.borderRadius.circle};
`

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-column-gap: 40px;
`
