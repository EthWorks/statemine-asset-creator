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

  it('formats when value.length has smaller value than decimals.value', async () => {
    renderWithTheme(<BalanceValue value={new BN('1234')} token='KSM' decimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.0012')
  })

  it('rounds up the balance value', async () => {
    renderWithTheme(<BalanceValue value={new BN('12345')} token='KSM' decimals={5} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.1235')
  })

  it('formats zero', async () => {
    renderWithTheme(<BalanceValue value={new BN('0')} token='KSM' decimals={10} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.0000')
  })

  it('formats for no decimals', async () => {
    renderWithTheme(<BalanceValue value={new BN('1000000')} token='KSM' decimals={0} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,000,000.0000')
  })
})
