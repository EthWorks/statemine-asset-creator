import BN from 'bn.js'
import styled from 'styled-components'

import { FormatBalance, Label } from '..'

export interface TotalValueProps {
  decimalsAmount: number,
  decimalsFee: number,
  token: string,
  totalAmount: BN,
  totalFee: BN,
  totalFeeInfo?: string,
  totalAmountInfo?: string
}

export const TotalValue = ({ decimalsAmount, decimalsFee, totalAmount, totalFee, token }: TotalValueProps): JSX.Element => (
  <TotalValueWrapper>
    <StyledLabel>Total amount:</StyledLabel>
    <BalanceWrapper>
      <FormatBalance chainDecimals={decimalsAmount} token={token} value={totalAmount} />
    </BalanceWrapper>
    <StyledLabel>Transaction fee:</StyledLabel>
    <BalanceWrapper>
      <FormatBalance chainDecimals={decimalsFee} token={token} value={totalFee} />
    </BalanceWrapper>
  </TotalValueWrapper>
)

const TotalValueWrapper = styled.div`
  display: grid;
  grid-template-columns: 160px auto;
  grid-column-gap: 40px;
  grid-row-gap: 4px;
  width: fit-content;
  margin: 24px 0 0 auto;
`

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
  & > div {
    margin-right: 6px;
  }
`

const StyledLabel = styled(Label)`
  text-align: right;
`
