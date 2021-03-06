import BN from 'bn.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { Text } from '../typography'
import { formatBalance } from './utils'

interface BalanceValueProps {
  className?: string,
  chainDecimals: number | undefined,
  token: string | undefined,
  value: BN | undefined
}

export const FormatBalance = ({ className, chainDecimals, token, value }: BalanceValueProps): React.ReactElement<BalanceValueProps> | null => {
  const { integers, decimals } = useMemo(() => formatBalance(value, chainDecimals), [chainDecimals, value]) || {}

  return (
    <ValueWrapper className={className} data-testid='balance-value'>
      <TextBalance size='SM' color='white'>{integers}.<span>{decimals}</span></TextBalance>
      <Text size='SM'>{token}</Text>
    </ValueWrapper>
  )
}

const TextBalance = styled(Text)`
  margin-right: 4px;
  
  span {
    color: ${({ theme }) => theme.colors.gray400};
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
`
