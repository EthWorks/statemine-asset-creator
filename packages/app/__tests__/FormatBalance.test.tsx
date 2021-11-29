import { screen } from '@testing-library/react'
import BN from 'bn.js'

import { FormatBalance } from '../components'
import { renderWithTheme } from './helpers'

describe('FormatBalance component', () => {
  it('formats data', async () => {
    renderWithTheme(<FormatBalance value={new BN('1234567891')} token='KSM' chainDecimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,234.5679KSM')
  })

  it('formats when requested decimal places exceed number of digits in value', async () => {
    renderWithTheme(<FormatBalance value={new BN('1234')} token='KSM' chainDecimals={6} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.0012KSM')
  })

  it('rounds up the balance value', async () => {
    renderWithTheme(<FormatBalance value={new BN('12345')} token='TT' chainDecimals={5} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.1235TT')
  })

  it('formats zero', async () => {
    renderWithTheme(<FormatBalance value={new BN('0')} token='TT' chainDecimals={10} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('0.0000TT')
  })

  it('formats for zero decimal places', async () => {
    renderWithTheme(<FormatBalance value={new BN('1000000')} token='KSM' chainDecimals={0} />)

    const balanceValue = await screen.findByTestId('balance-value')
    expect(balanceValue).toHaveTextContent('1,000,000.0000KSM')
  })
})
