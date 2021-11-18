import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'

import { NumericInput } from '../components'
import { renderWithTheme } from './helpers'

interface Props {
  nonDecimal?: boolean
  nonNegative?: boolean
}

function NumericInputTestComponent({ nonDecimal = false, nonNegative = false }: Props): JSX.Element {
  const [value, setValue] = useState<string>('')

  return (
    <>
      <div data-testid='input-state'>Value: {value}</div>
      <NumericInput 
        id='num-input'
        label='NumericInput'
        value={value}
        onChange={setValue}
        nonDecimal={nonDecimal}
        nonNegative={nonNegative}/>
    </>
  )
}

const RANDOM_INPUT = '/--1&&11A,D.2.&^%22  ..2-'

describe('NumericInput component', () => {
  describe('by default', () => {
    it('takes negative, decimal numbers', async () => {
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

    it('random input test', async () => {
      renderWithTheme(<NumericInputTestComponent/>)

      fillInput(RANDOM_INPUT)

      await expectValue('Value: -111.2222')
    })
  })

  describe('non decimal', () => {
    it('ignores fraction dots', async () => {
      renderWithTheme(<NumericInputTestComponent nonDecimal/>)

      fillInput('-111.2.22..2')

      await expectValue('Value: -1112222')
    })

    it('random input test', async () => {
      renderWithTheme(<NumericInputTestComponent nonDecimal/>)

      fillInput(RANDOM_INPUT)

      await expectValue('Value: -1112222')
    })
  })

  describe('non negative', () => {
    it('ignores the "-" sign', async () => {
      renderWithTheme(<NumericInputTestComponent nonNegative/>)

      fillInput('-111.2222')

      await expectValue('Value: 111.2222')
    })

    it('random input test', async () => {
      renderWithTheme(<NumericInputTestComponent nonNegative/>)

      fillInput(RANDOM_INPUT)

      await expectValue('Value: 111.2222')
    })
  })

  describe('non negative & non decimal', () => {
    it('ignores the "-" sign and decimal dot', async () => {
      renderWithTheme(<NumericInputTestComponent nonNegative nonDecimal/>)

      fillInput('-111.2222')

      await expectValue('Value: 1112222')
    })

    it('random input test', async () => {
      renderWithTheme(<NumericInputTestComponent nonNegative nonDecimal/>)

      fillInput(RANDOM_INPUT)

      await expectValue('Value: 1112222')
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
