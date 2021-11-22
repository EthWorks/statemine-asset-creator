import { BigNumber } from 'bignumber.js'
import BN from 'bn.js'

export const roundBalance = (value: BN | string, decimalPlaces: number): string => {
  return new BigNumber(value.toString()).toFormat(decimalPlaces)
}
