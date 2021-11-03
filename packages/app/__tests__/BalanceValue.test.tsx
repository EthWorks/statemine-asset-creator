import { render, screen } from '@testing-library/react'
import BN from 'bn.js'

import BalanceValue from '../components/AccountSelect/BalanceValue'

describe('BalanceValue component', () => {
  it('formats data', async () => {
    render(<BalanceValue value={new BN('1234567891')} token='KSM' decimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,234.556')
  })
})
