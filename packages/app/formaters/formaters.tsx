import { BigNumber } from 'bignumber.js'
import BN from 'bn.js'

export const roundBalance = (value: BN | string, decimalPlaces: number): string => {
  return new BigNumber(value.toString()).toFormat(decimalPlaces)
}

export const shortAddress = (address: string, length = 12): string => (
  length >= address.length
    ? address
    : address.substring(0, Math.ceil(length / 2)) + '...' + address.substring(address.length - Math.floor(length / 2), address.length)
)
