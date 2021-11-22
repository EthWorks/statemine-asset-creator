import { screen } from '@testing-library/react'
import BN from 'bn.js'

import BalanceValue from '../components/BalanceValue'
import { renderWithTheme } from './helpers'

describe('BalanceValue component', () => {
  it('formats data', async () => {
    renderWithTheme(<BalanceValue value={new BN('1234567891')} token='KSM' decimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,234.5679KSM')
  })

  it('formats when value.length has smaller value than decimals.value', async () => {
    renderWithTheme(<BalanceValue value={new BN('1234')} token='KSM' decimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.0012KSM')
  })

  it('rounds up the balance value', async () => {
    renderWithTheme(<BalanceValue value={new BN('12345')} token='TT' decimals={5} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.1235TT')
  })

  it('formats zero', async () => {
    renderWithTheme(<BalanceValue value={new BN('0')} token='TT' decimals={10} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.0000TT')
  })

  it('formats for no decimals', async () => {
    renderWithTheme(<BalanceValue value={new BN('1000000')} token='KSM' decimals={0} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,000,000.0000KSM')
  })
})
