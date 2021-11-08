import BN from 'bn.js'
import styled from 'styled-components'

import { Account, Chains, useBalances } from 'use-substrate'

import AvatarIcon from '../../assets/img/avatar2.png'
import Avatar from '../Avatar/Avatar'
import { Label, Text } from '../typography'
import BalanceValue from './BalanceValue'

interface Props {
  account: Account,
  withFreeBalance?: boolean
}

export function AccountTile({ account, withFreeBalance }: Props): JSX.Element {
  const balance = useBalances(account.address, Chains.Kusama)

  return (
    <AccountTileWrapper>
      <AccountTileCell>
        <Avatar src={AvatarIcon} size='m' />
        <AccountTileName>
          <TextName size='SM' color='red'>{account.name}</TextName>
          <TextAddress size='SM'>{account.address}</TextAddress>
        </AccountTileName>
      </AccountTileCell>
      <AccountTileCellEnd>
        <CellRow>
          <Label>transferable balance</Label>
          <ValueWrapper>
            <BalanceValue token='KSM' decimals={5} value={new BN('1234567891')} />
          </ValueWrapper>
        </CellRow>
        {withFreeBalance &&
          <CellRow>
            <Label>full account balance</Label>
            <ValueWrapper>
              <TextBalance size='SM' color='white'>{balance?.freeBalance.toString()}</TextBalance>
              <Text size='SM'>KSM</Text>
            </ValueWrapper>
          </CellRow>
        }
      </AccountTileCellEnd>
    </AccountTileWrapper>
  )
}

const AccountTileWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;
  padding: 18px 48px 18px 16px;
`

const AccountTileName = styled.div`
  text-align: left;
  margin-left: 8px;
`

const AccountTileCell = styled.div`
  display: flex;
  align-items: center;
`

const AccountTileCellEnd = styled(AccountTileCell)`
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`

const CellRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  
  & + div {
    margin-top: 4px;
  }
`

const TextName = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[50]};
`

const TextBalance = styled(Text)`
  margin-right: 4px;
`

const TextAddress = styled(Text)`
  overflow: hidden;
  max-width: 210px;
  text-overflow: ellipsis;
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
`
