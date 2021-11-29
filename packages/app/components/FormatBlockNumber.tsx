import type { FC } from 'react'
import type{ BlockNumber } from '@polkadot/types/interfaces'

import { formatValue } from '../formaters/formaters'
import { Text } from './typography'

interface Props {
  value: BlockNumber | undefined;
}

export const FormatBlockNumber: FC<Props> = ({ value }) => {
  const formattedBlockNumber = value
    ? '#' + formatValue(value)
    : '-'

  return (
    <Text size='XXS' color='white' bold>
      {formattedBlockNumber}
    </Text>
  )
}
