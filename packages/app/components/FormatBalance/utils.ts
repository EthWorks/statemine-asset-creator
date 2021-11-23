import BN from 'bn.js'

import { roundBalance } from '../../formaters/formaters'

const DECIMALS_DISPLAYED = 4

export function formatBalance(value: BN | undefined, chainDecimals: number): { integers: string, decimals: string } | undefined {
  if (!value) {
    return undefined
  }

  const balanceWithPaddedZeroes = value.toString().padStart(chainDecimals, '0')
  const integerPartLength = balanceWithPaddedZeroes.length - chainDecimals
  const balanceWithSeparator = balanceWithPaddedZeroes.substring(0, integerPartLength) + '.' + balanceWithPaddedZeroes.substring(integerPartLength, balanceWithPaddedZeroes.length)

  const roundedBalance = roundBalance(balanceWithSeparator, DECIMALS_DISPLAYED)
  const [integers, decimals] = roundedBalance.split('.')

  return { integers, decimals }
}
