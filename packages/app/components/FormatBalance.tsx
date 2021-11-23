import BN from 'bn.js'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { roundBalance } from '../formaters/formaters'
import { Text } from './typography'

const DECIMALS_DISPLAYED = 4

interface BalanceValueProps {
  chainDecimals: number,
  token: string,
  value: BN | undefined
}

function padLeadingZeros(balance: BN, decimals: number): string {
  let balanceAsString = balance.toString()

  while (balanceAsString.length <= decimals) {
    balanceAsString = '0' + balanceAsString
  }

  return balanceAsString
}

const FormatBalance = ({ chainDecimals, token, value }: BalanceValueProps): React.ReactElement<BalanceValueProps> | null => {
  const { integers, decimals } = useMemo(() => {
    if (!value) {
      return undefined
    }
    
    const balanceWithPaddedZeroes = padLeadingZeros(value, chainDecimals)
    const integerPartLength = balanceWithPaddedZeroes.length - chainDecimals
    const balanceWithSeparator = balanceWithPaddedZeroes.substring(0, integerPartLength) + '.' + balanceWithPaddedZeroes.substring(integerPartLength, balanceWithPaddedZeroes.length)

    const roundedBalance = roundBalance(balanceWithSeparator, DECIMALS_DISPLAYED)
    const integers = roundedBalance?.substr(0, roundedBalance.length - DECIMALS_DISPLAYED)
    const decimals = roundedBalance?.substr(roundedBalance.length - DECIMALS_DISPLAYED, DECIMALS_DISPLAYED)

    return { integers, decimals }
  }, [chainDecimals, value]) || {}

  return (
    <ValueWrapper data-testid='balance-value'>
      <TextBalance size='SM' color='white'>{integers}<span>{decimals}</span></TextBalance>
      <Text size='SM'>{token}</Text>
    </ValueWrapper>
  )
}

export default FormatBalance

const TextBalance = styled(Text)`
  margin-right: 4px;
  
  span {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
`
