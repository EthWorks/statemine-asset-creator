import type { FC } from 'react'
import type{ BlockNumber } from '@polkadot/types/interfaces'

import { formatValue } from '../formaters/formaters'

interface Props {
  value: BlockNumber | undefined;
}

export const FormatBlockNumber: FC<Props> = ({ value }) => {
  const formattedBlockNumber = value
    ? '#' + formatValue(value)
    : '-'
  
  return (
    <>
      {formattedBlockNumber}
    </>
  )
}
