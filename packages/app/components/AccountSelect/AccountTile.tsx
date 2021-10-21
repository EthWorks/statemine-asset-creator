import { Account, useBalances } from 'use-substrate'
import styled from 'styled-components'
import { Text } from '../typography/Text'
import Avatar from '../Avatar/Avatar'
import AvatarIcon from '../../assets/img/avatar2.png'
import { Label } from '../typography/Label'
import { Arrow } from '../icons/Arrow'

interface Props {
  account: Account,
  arrow: boolean
}

export function AccountTile({ account, arrow }: Props): JSX.Element {
  const balance = useBalances(account.address)

  return (
    <AccountTileWrapper>
      <AccountTileCell>
        <Avatar  src={AvatarIcon} size='m' />
        <AccountTileName>
          <TextName size='SM' color='red'>{account.name}</TextName>
          <Text size='SM'>{account.address}</Text>
        </AccountTileName>
      </AccountTileCell>
      <AccountTileCellEnd>
        {console.log('##########################')}
        {console.log(balance?.availableBalance)}
        {balance?.availableBalance.toString() === '0' && <Label>transferable Balance</Label>}
      </AccountTileCellEnd>
      <AccountTileCellEnd>
        <TextBalance size='SM' color='white'>{balance?.freeBalance.toString()}</TextBalance>
        <Text size='SM'>KSM</Text>
        {/*Full Account Balance: {balance?.freeBalance.toString()}*/}
      </AccountTileCellEnd>
      {arrow && <StyledArrow direction='down' />}
    </AccountTileWrapper>
  )
}

const AccountTileWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr .8fr 100px;
  grid-gap: 12px;
  padding: 18px 48px 18px 16px;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const AccountTileName = styled.div`
  text-align: left;
`

const AccountTileCell = styled.div`
  display: flex;
  align-items: center;
`

const AccountTileCellEnd = styled(AccountTileCell)`
  justify-content: flex-end;
  text-align: right;
`

const TextName = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[50]};
`

const TextBalance = styled(Text)`
  margin-right: 4px;
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`
