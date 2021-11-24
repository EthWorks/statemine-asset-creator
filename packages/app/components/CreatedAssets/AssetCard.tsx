import type { FC } from 'react'
import type { Asset } from 'use-substrate'

import { Account } from './Account'
import { groupRoles } from './groupRoles'

interface Props {
  asset: Asset
}

import { useRef } from 'react'
import styled from 'styled-components'

import { useOutsideClick,useToggle } from '../../utils'
import { ButtonSquare } from '../button/Button'
import { Card } from '../Card'
import FormatBalance from '../FormatBalance'
import { Text } from '../typography'
import { AssetsCardMenu } from './AssetsCardMenu'

export const AssetCard: FC<Props> = ({ asset }) => {
  const { name, id, decimals, supply, admin, issuer, freezer } = asset
  const rolesByAccount = groupRoles({ admin, issuer, freezer })
  const [isOpen, toggleOpen, setIsOpen] = useToggle()
  const cardMenuContainerRef = useRef(null)
  useOutsideClick(cardMenuContainerRef, () => setIsOpen(false))

  return (
    <StyledCard padding='s' data-testid={`asset-card-${id.toNumber()}`}>
      <CardHeader>
        <CardTitle size='SM'>{name}</CardTitle>
        <CardMenuContainer ref={cardMenuContainerRef}>
          <StyledButtonSquare onClick={toggleOpen}>
            <Dot />
          </StyledButtonSquare>
          <AssetsCardMenu isOpen={isOpen} />
        </CardMenuContainer>
      </CardHeader>
      <CardContent>
        <Circle>
          <CardTitle size='SM'>KSM</CardTitle>
        </Circle>
        <div>
          <CardInfo>
            <Text size='XXS' bold>id:</Text>
            <Text size='XS' color='white'>{id.toNumber()}</Text>
          </CardInfo>
          <CardInfo>
            <Text size='XXS' bold>total supply:</Text>
            <FormatBalance token='KSM' chainDecimals={decimals} value={supply} />
          </CardInfo>
          <CardInfo>
            <Text size='XXS' bold>decimals:</Text>
            <Text size='XS' color='white'>{decimals}</Text>
          </CardInfo>
        </div>
      </CardContent>

      {rolesByAccount.map(account => <Account key={account[0].toString()} account={account[0].toString()} role={account[1]}/>)}
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  overflow: hidden;
  min-height: 276px;
`

const CardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const CardTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[50]}
`

const CardContent = styled.div`
  display: flex;
  align-items: center;
`

const Circle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  min-width: 64px;
  height: 64px;
  margin-right: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: 1px solid ${({ theme }) => theme.colors.pinkLight};
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    border: 1px solid ${({ theme }) => theme.colors.pinkLight};
  }
`

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  
  p {
    text-transform: uppercase;
    line-height: 20px;
  }
  
  & > p {
    margin-right: 4px;
  }
`

const StyledButtonSquare = styled(ButtonSquare)`
  &:hover {
    background: transparent;
  }
`

const Dot = styled.span`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.borderRadius.circle};
  }
  
  &:before {
    transform: translate(-50%, calc(-50% - 6px));
  }

  &:after {
    transform: translate(-50%, calc(-50% + 6px));
  }
`

const CardMenuContainer = styled.div`
  position: relative;
`
