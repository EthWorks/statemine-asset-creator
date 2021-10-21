import { Account, useBalances } from 'use-substrate'
import styled from 'styled-components'
import { Text } from '../typography/Text'
import Avatar from '../Avatar/Avatar'
import AvatarIcon from '../../assets/img/avatar2.png'
import { Label } from '../typography/Label'

interface Props {
  account: Account,
  hasFreeBalance?: boolean
}

export function AccountTile({ account, hasFreeBalance }: Props): JSX.Element {
  const balance = useBalances(account.address)

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
          <Label>transferable Balance</Label>
          <TextBalance size='SM' color='white'>{balance?.availableBalance.toString()}</TextBalance>
          <Text size='SM'>KSM</Text>
        </CellRow>
        {hasFreeBalance &&
          <CellRow>
            <Label>Full ACCOUNT BALANCE</Label>
            <TextBalance size='SM' color='white'>{balance?.freeBalance.toString()}</TextBalance>
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
