import type { FC } from 'react'
import type { Role } from './types'

import styled from 'styled-components'

import { shortAddress } from '../../formatters'
import { Avatar } from '../Avatar'
import { Text } from '../typography'

interface Props {
  account: string,
  role: Role[]
}

export const Account: FC<Props> = ({ account, role }) => {
  return (
    <AccountWrapper data-testid={`role-${role.join('-')}`}>
      <Avatar address={account} size='s'/>
      <AccountNameBox>
        <StyledText size='XXS' color='white'>{role.join(', ')}</StyledText>
        <NameWrapper>
          <TextName size='XXS'>
            Account name
          </TextName>
          <Text size='XXS'>
            {shortAddress(account)}
          </Text>
        </NameWrapper>
      </AccountNameBox>
    </AccountWrapper>
  )
}

const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`

const AccountNameBox = styled.div`
  margin-left: 8px;
`

const StyledText = styled(Text)`
  text-transform: uppercase;
`

const NameWrapper = styled.div`
  display: flex;
  
  p {
    white-space: nowrap;
  }
`

const TextName = styled(Text)`
  position: relative;
  padding-right: 6px;
  margin-right: 4px;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 2px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.gray[400]};
    border-radius: ${({ theme }) => theme.borderRadius.circle};
  }
`
