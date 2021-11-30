import type { FC } from 'react'
import type { Asset } from 'use-substrate'

import { useMemo, useRef } from 'react'
import styled from 'styled-components'

import { drawColor, useOutsideClick, useToggle } from '../../utils'
import { ButtonSquare } from '../button/Button'
import { Card } from '../Card'
import { FormatBalance } from '../FormatBalance'
import { Text } from '../typography'
import { Account } from './Account'
import { AssetImage } from './AssetImage'
import { AssetsCardMenu } from './AssetsCardMenu'
import { groupRoles } from './groupRoles'

interface Props {
  asset: Asset
}

export const AssetCard: FC<Props> = ({ asset }) => {
  const { name, id, decimals, supply, admin, issuer, freezer, symbol } = asset
  const rolesByAccount = groupRoles({ admin, issuer, freezer })
  const [isOpen, toggleOpen, setIsOpen] = useToggle()
  const cardMenuContainerRef = useRef(null)
  useOutsideClick(cardMenuContainerRef, () => setIsOpen(false))

  const color = useMemo(() => drawColor(), [])

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
        <AssetImage color={color}>
          <CardTitle size='SM'>{symbol}</CardTitle>
        </AssetImage>
        <div>
          <CardInfo>
            <Text size='XXS' bold>id:</Text>
            <Text size='XS' color='white'>{id.toNumber()}</Text>
          </CardInfo>
          <CardInfo>
            <Text size='XXS' bold>total supply:</Text>
            <FormatBalance token={symbol} chainDecimals={decimals} value={supply} />
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
