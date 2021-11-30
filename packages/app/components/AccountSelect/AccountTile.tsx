import BaseIdentityIcon from '@polkadot/react-identicon'
import type { Account } from 'use-substrate'

import { useMemo } from 'react'
import styled from 'styled-components'

import { Chains, useBalances } from 'use-substrate'

import { FormatBalance } from '../FormatBalance'
import { Label, Text } from '../typography'

interface Props {
  account: Account,
  withFreeBalance?: boolean
}

const TOKEN = 'KSM'
const DECIMALS = 12

export function AccountTile({ account, withFreeBalance }: Props): JSX.Element {
  const balance = useBalances(account.address, Chains.Kusama)
  const size = 32
  const theme = 'polkadot'

  const fullBalance = useMemo(() => balance?.freeBalance.add(balance.reservedBalance), [balance])

  return (
    <AccountTileWrapper>
      <AccountTileCell>
        <BaseIdentityIcon
          value={account.address}
          size={size}
          theme={theme}
        />
        <AccountTileName>
          <TextName size='SM' color='red'>{account.name}</TextName>
          <TextAddress size='SM'>{account.address}</TextAddress>
        </AccountTileName>
      </AccountTileCell>
      <AccountTileCellEnd>
        <CellRow>
          <Label>transferable balance</Label>
          <FormatBalance token={TOKEN} chainDecimals={DECIMALS} value={balance?.availableBalance}/>
        </CellRow>
        {withFreeBalance &&
          <CellRow>
            <Label>full account balance</Label>
            <FormatBalance token={TOKEN} chainDecimals={DECIMALS} value={fullBalance}/>
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

const TextAddress = styled(Text)`
  overflow: hidden;
  max-width: 210px;
  text-overflow: ellipsis;
`
