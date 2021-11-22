import { BigNumber } from 'bignumber.js'
import BN from 'bn.js'

export const formatBalanceValue = (value: BN | string): string => {
  return new BigNumber(value.toString()).toFormat(4)
}

export const shortAddress = (address: string, length = 12): string => (
  length >= address.length
    ? address
    : address.substring(0, Math.ceil(length / 2)) + '...' +  address.substring(address.length - Math.floor(length / 2), address.length)
)
