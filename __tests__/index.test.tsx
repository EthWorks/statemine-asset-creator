import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  it('displays balance of hardcoded account', async () => {
    render(<Home />)

    screen.getByRole('heading', {name: /welcome to Statemine/i})
    await screen.findByText('Balance: 3500')
  })
})
