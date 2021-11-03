import BN from 'bn.js'
import React from 'react'
import styled from 'styled-components'

import { formatBalanceValue } from '../../formaters/formaters'
import { Text } from '../typography'

interface BalanceValueProps {
  decimals: number,
  token: string,
  value: BN
}

const BalanceValue = ({ decimals, token, value }: BalanceValueProps): React.ReactElement<BalanceValueProps> | null => {
  if (!value) {
    return null
  }

  let balanceValue = value.toString()

  balanceValue = balanceValue.substring(0, (balanceValue.length - decimals)) + '.' + balanceValue.substring((balanceValue.length - decimals), balanceValue.length)
  balanceValue = formatBalanceValue(balanceValue)

  const integers = balanceValue.substr(0, balanceValue.length - 4)
  const decimalPlaces = balanceValue.substr(balanceValue.length - 4, 4)

  return (
    <>
      <TextBalance data-testid='balance-value' size='SM' color='white'>{integers}<span>{decimalPlaces}</span></TextBalance>
      <Text size='SM'>{token}</Text>
    </>
  )
}

export default BalanceValue

const TextBalance = styled(Text)`
  margin-right: 4px;
  
  span {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`
