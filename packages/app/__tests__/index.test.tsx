import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

jest.mock('use-substrate', () => ({
  useBalances: () => ({
    freeBalance: 3600,
    availableBalance: 4000,
    lockedBalance: 300,
    accountNonce: 1
  })
}))

describe('Home', () => {
  it('displays balance of hardcoded account', async () => {
    render(<Home />)

    screen.getByRole('heading', { name: /welcome to Statemine/i })
    await screen.findByText('Balance: 3600')
  })
})
