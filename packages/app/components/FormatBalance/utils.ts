import BN from 'bn.js'

import { roundBalance } from '../../formaters/formaters'

const DECIMALS_DISPLAYED = 4

function padLeadingZeros(balance: BN, decimals: number): string {
  let balanceAsString = balance.toString()

  while (balanceAsString.length <= decimals) {
    balanceAsString = '0' + balanceAsString
  }

  return balanceAsString
}

export function formatBalance(value: BN | undefined, chainDecimals: number): { integers: string, decimals: string } | undefined {
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
}
