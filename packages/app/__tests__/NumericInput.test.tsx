import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'

import { NumericInput } from '../components'
import { renderWithTheme } from './helpers'

interface Props {
  nonDecimal?: boolean
}

function NumericInputTestComponent({ nonDecimal = false }: Props): JSX.Element {
  const [value, setValue] = useState<string>('')

  return (
    <>
      <div data-testid='input-state'>Value: {value}</div>
      <NumericInput id='num-input' label='NumericInput' value={value} onChange={setValue} nonDecimal={nonDecimal}/>
    </>
  )
}

describe('NumericInput component', () => {
  describe('by default', () => {
    it('input takes negative, decimal numbers', async () => {
      renderWithTheme(<NumericInputTestComponent/>)

      fillInput('-111.2222')

      await expectValue('Value: -111.2222')
    })

    it('ignores letters', async () => {
      renderWithTheme(<NumericInputTestComponent/>)

      fillInput('-1a11.a22a22')

      await expectValue('Value: -111.2222')
    })

    it('accepts only one dot in a fraction', async () => {
      renderWithTheme(<NumericInputTestComponent/>)

      fillInput('-111.2.22..2')

      await expectValue('Value: -111.2222')
    })
  })

  describe('non decimal', () => {
    it('ignores fraction dots', async () => {
      renderWithTheme(<NumericInputTestComponent nonDecimal/>)

      fillInput('-111.2.22..2')

      await expectValue('Value: -1112222')
    })
  })
})

async function expectValue(expectedValue: string): Promise<void> {
  const valueContainer = await screen.findByTestId('input-state')
  await within(valueContainer).findByText(expectedValue)
}

function fillInput(value: string) {
  userEvent.type(screen.getByLabelText('NumericInput'), value)
}
