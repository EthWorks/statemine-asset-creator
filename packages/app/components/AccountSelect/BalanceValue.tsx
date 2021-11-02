import BN from 'bn.js'
import React from 'react'
import styled from 'styled-components'

import { formatBalanceValue } from '../../formaters/formaters'
import { Text } from '../typography'

interface BalanceValueProps {
  value: BN | string | undefined
}

const BalanceValue = ({ value }: BalanceValueProps): React.ReactElement<BalanceValueProps> | null => {
  if (!value) {
    return null
  }

  const balanceValue = formatBalanceValue(value)
  const integers = balanceValue.substr(0, balanceValue.length - 4)
  const decimalPlaces = balanceValue.substr(balanceValue.length - 4, 4)

  return (
    <TextBalance size='SM' color='white'>{integers}<span>{decimalPlaces}</span></TextBalance>
  )
}

export default BalanceValue

const TextBalance = styled(Text)`
  margin-right: 4px;
  
  span {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`
