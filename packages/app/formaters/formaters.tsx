import { BigNumber } from 'bignumber.js'
import BN from 'bn.js'

export const formatBalanceValue = (value: BN | string): string => {
  return new BigNumber(value.toString()).toFormat(4)
}
