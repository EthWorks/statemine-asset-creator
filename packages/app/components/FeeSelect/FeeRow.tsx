import BN from 'bn.js'
import styled from 'styled-components'

import { FormatBalance } from '../FormatBalance'
import { Text } from '../typography'

interface FeeRowProps {
  balance: BN | undefined,
  decimals: number,
  token: string
}

export const FeeRow = ({ balance, decimals, token }: FeeRowProps): JSX.Element => (
  <FeeRowWrapper>
    <FeeSymbol size='SM' color='white'>{token}</FeeSymbol>
    <StyledText size='XS'>BALANCE</StyledText>
    <StyledFormatBalance chainDecimals={decimals} token={token} value={balance} />
  </FeeRowWrapper>
)

const FeeRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 0.7fr;
  grid-column-gap: 12px;
  align-items: center;
  padding-right: 26px;
  width: 100%;
`

const FeeSymbol = styled(Text)`
  margin-right: auto;
`

const StyledFormatBalance = styled(FormatBalance)`
  justify-content: flex-end;
  
  p {
    text-align: right;
  }
`

const StyledText = styled(Text)`
  text-align: right;
`
