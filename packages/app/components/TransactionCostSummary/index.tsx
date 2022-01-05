import BN from 'bn.js'
import styled from 'styled-components'

import { TooltipBox } from '../Tooltip'
import { FormatBalance, Label } from '..'

export interface TransactionCostSummaryProps {
  decimals: number,
  token: string,
  totalAmount: BN,
  totalFee: BN,
  totalFeeInfo?: string,
  totalAmountInfo?: string
}

export const TransactionCostSummary = ({ decimals, totalAmount, totalFee, token }: TransactionCostSummaryProps): JSX.Element => (
  <TransactionCostSummaryWrapper data-testid='transaction-cost-summary'>
    <StyledLabel>Total amount:</StyledLabel>
    <BalanceWrapper>
      <FormatBalance chainDecimals={decimals} token={token} value={totalAmount} />
      <TooltipBox text='Total amount tooltip info' />
    </BalanceWrapper>
    <StyledLabel>Transaction fee:</StyledLabel>
    <BalanceWrapper>
      <FormatBalance chainDecimals={decimals} token={token} value={totalFee} />
      <TooltipBox text='Transaction fee tooltip info' />
    </BalanceWrapper>
  </TransactionCostSummaryWrapper>
)

const TransactionCostSummaryWrapper = styled.div`
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
