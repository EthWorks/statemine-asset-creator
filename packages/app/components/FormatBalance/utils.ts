import BN from 'bn.js'

import { formatValue } from '../../formaters/formaters'

const DECIMALS_DISPLAYED = 4

export function formatBalance(value: BN | undefined, chainDecimals: number | undefined): { integers: string, decimals: string } | undefined {
  if (!value || chainDecimals === undefined) {
    return undefined
  }

  const balanceWithPaddedZeroes = value.toString().padStart(chainDecimals, '0')
  const integerPartLength = balanceWithPaddedZeroes.length - chainDecimals
  const balanceWithSeparator = balanceWithPaddedZeroes.substring(0, integerPartLength) + '.' + balanceWithPaddedZeroes.substring(integerPartLength, balanceWithPaddedZeroes.length)

  const roundedBalance = formatValue(balanceWithSeparator, DECIMALS_DISPLAYED)
  const [integers, decimals] = roundedBalance.split('.')

  return { integers, decimals }
}
