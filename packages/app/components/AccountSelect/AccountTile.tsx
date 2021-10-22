import styled from 'styled-components'

import { Account, Chains, useBalances } from 'use-substrate'

import AvatarIcon from '../../assets/img/avatar2.png'
import Avatar from '../Avatar/Avatar'
import { Label } from '../typography/Label'
import { Text } from '../typography/Text'

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
          <TextBalance size='SM' color='white'>{balance?.availableBalance.toString()}</TextBalance>
          <Text size='SM'>KSM</Text>
        </CellRow>
        {withFreeBalance &&
          <CellRow>
            <Label>full account balance</Label>
            <TextBalance size='SM' color='white'>{balance?.freeBalance.add(balance.reservedBalance).toString()}</TextBalance>
            <Text size='SM'>KSM</Text>
          </CellRow>
        }
      </AccountTileCellEnd>
    </AccountTileWrapper>
  )
}

const AccountTileWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 18px 48px 18px 16px;
`

const AccountTileName = styled.div`
  text-align: left;
  margin-left: 8px;
`

const AccountTileCell = styled.div`
  display: flex;
  align-items: center;
  
  & + div {
    margin-left: 50px;
  }
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
  
  & + div {
    margin-top: 4px;
  }
`

const TextName = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[50]};
`

const TextBalance = styled(Text)`
  margin: 0 4px 0 50px;
`

const TextAddress = styled(Text)`
  overflow: hidden;
  max-width: 210px;
  text-overflow: ellipsis;
`
