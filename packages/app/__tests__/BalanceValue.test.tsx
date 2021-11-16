import { screen } from '@testing-library/react'
import BN from 'bn.js'

import BalanceValue from '../components/AccountSelect/BalanceValue'
import { renderWithTheme } from './helpers'

describe('BalanceValue component', () => {
  it('formats data', async () => {
    renderWithTheme(<BalanceValue value={new BN('1234567891')} token='KSM' decimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,234.5679')
  })
})
