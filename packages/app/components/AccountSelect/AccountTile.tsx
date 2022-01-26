import type { Account } from 'use-substrate'

import { useMemo } from 'react'
import styled from 'styled-components'

import { Chains, useBalances, useChainToken } from 'use-substrate'

import { Avatar } from '../Avatar'
import { FormatBalance } from '../FormatBalance'
import { TooltipBox } from '../Tooltip'
import { Label, Text } from '../typography'

interface Props {
  account: Account,
  chain: Chains,
  withFullBalance?: boolean
}

export function AccountTile({ account, chain, withFullBalance }: Props): JSX.Element {
  const balance = useBalances(account.address, chain)
  const { chainDecimals, chainToken } = useChainToken(chain) || {}

  const fullBalance = useMemo(() => balance?.freeBalance.add(balance.reservedBalance), [balance])

  return (
    <AccountTileWrapper>
      <AccountTileCell>
        <Avatar address={account.address} size='m'/>
        <AccountTileName>
          <TextName size='SM' color='red'>{account.name}</TextName>
          <TextAddress size='SM'>{account.address}</TextAddress>
        </AccountTileName>
      </AccountTileCell>
      <AccountTileCellEnd>
        {withFullBalance && (
          <CellRow>
            <Label>full account balance</Label>
            <FormatBalance token={chainToken} chainDecimals={chainDecimals} value={fullBalance}/>
          </CellRow>
        )}
        <CellRow>
          <StyledLabel>
            transferable balance
            <TooltipBox text='Your account needs to have some funds to stay active and have Existential Deposit' />
          </StyledLabel>
          <FormatBalance token={chainToken} chainDecimals={chainDecimals} value={balance?.availableBalance}/>
        </CellRow>
      </AccountTileCellEnd>
    </AccountTileWrapper>
  )
}

const AccountTileWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
  
  div {
    margin-left: 8px;
  }
`
