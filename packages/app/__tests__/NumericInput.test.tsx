import type { NumericInputType } from '../components'

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'

import { NumericInput } from '../components'
import { renderWithTheme } from './helpers'

interface Props {
  inputType?: NumericInputType
}

function NumericInputTestComponent({ inputType = 'DEFAULT' }: Props): JSX.Element {
  const [value, setValue] = useState<string>('')

  return (
    <>
      <div data-testid='input-state'>Value: {value}</div>
      <NumericInput
        id='num-input'
        label='NumericInput'
        value={value}
        onChange={setValue}
        inputType={inputType}
      />
    </>
  )
}

const RANDOM_INPUT = '/--1&&11A,D.2.&^%22  ..2-'

describe('NumericInput component', () => {
  describe('by default', () => {
    beforeEach(() => {
      renderWithTheme(<NumericInputTestComponent/>)
    })

    ;['-', ''].forEach(sign => {
      const signDescription = sign === '-' ? 'negative' : 'positive'
      describe(`${signDescription}`, () => {
        it('takes decimals', async () => {
          fillInput(`${sign}111.2222`)

          await expectValue(`Value: ${sign}111.2222`)
        })

        it('ignores letters', async () => {
          fillInput(`${sign}1a11.a22a22`)

          await expectValue(`Value: ${sign}111.2222`)
        })

        it('accepts only one dot in a fraction', async () => {
          fillInput(`${sign}111.2.22..2`)

          await expectValue(`Value: ${sign}111.2222`)
        })

        describe('handles values starting with zero', () => {
          it('decimal', async () => {
            fillInput(`${sign}000.12`)

            await expectValue(`Value: ${sign}0.12`)
          })

          it('followed by non zero digits', async () => {
            fillInput(`${sign}0123`)

            await expectValue(`Value: ${sign}0`)
          })

          it('followed by multiple zeroes', async () => {
            fillInput(`${sign}0000`)

            await expectValue(`Value: ${sign}0`)
          })
        })
      })
    })

    it('random input test', async () => {
      fillInput(RANDOM_INPUT)

      await expectValue('Value: -111.2222')
    })
  })

  describe('integer', () => {
    beforeEach(() => {
      renderWithTheme(<NumericInputTestComponent inputType='INTEGER'/>)
    })

    ;['-', ''].forEach(sign => {
      const signDescription = sign === '-' ? 'negative' : 'positive'

      describe(`${signDescription}`, () => {
        it('ignores fraction dots', async () => {
          fillInput(`${sign}111.2.22..2`)

          await expectValue(`Value: ${sign}1112222`)
        })

        it('ignores letters', async () => {
          fillInput(`${sign}1a11.a22a22`)

          await expectValue(`Value: ${sign}1112222`)
        })

        describe('handles values starting with zero', () => {
          it('followed by non zero digits', async () => {
            fillInput(`${sign}0123`)

            await expectValue(`Value: ${sign}0`)
          })

          it('followed by multiple zeroes', async () => {
            fillInput(`${sign}0000`)

            await expectValue(`Value: ${sign}0`)
          })
        })
      })
    })

    it('random input test', async () => {
      fillInput(RANDOM_INPUT)

      await expectValue('Value: -1112222')
    })
  })

  describe('positive', () => {
    beforeEach(() => {
      renderWithTheme(<NumericInputTestComponent inputType='POSITIVE'/>)
    })

    it('ignores the "-" sign', async () => {
      fillInput('-111.2222')

      await expectValue('Value: 111.2222')
    })

    it('ignores letters', async () => {
      fillInput('1a11.a22a22')

      await expectValue('Value: 111.2222')
    })

    it('accepts only one dot in a fraction', async () => {
      fillInput('111.2.22..2')

      await expectValue('Value: 111.2222')
    })

    describe('handles values starting with zero', () => {
      it('decimal', async () => {
        fillInput('000.12')

        await expectValue('Value: 0.12')
      })

      it('followed by non zero digits', async () => {
        fillInput('0123')

        await expectValue('Value: 0')
      })

      it('followed by multiple zeroes', async () => {
        fillInput('0000')

        await expectValue('Value: 0')
      })
    })

    it('random input test', async () => {
      fillInput(RANDOM_INPUT)

      await expectValue('Value: 111.2222')
    })
  })

  describe('Natural', () => {
    beforeEach(() => {
      renderWithTheme(<NumericInputTestComponent inputType='NATURAL'/>)
    })

    it('ignores the "-" sign and decimal dot', async () => {
      fillInput('-111.2222')

      await expectValue('Value: 1112222')
    })

    it('ignores letters', async () => {
      fillInput('1a11.a22a22')

      await expectValue('Value: 1112222')
    })

    describe('handles values starting with zero', () => {
      it('followed by non zero digits', async () => {
        fillInput('0123')

        await expectValue('Value: 0')
      })

      it('followed by multiple zeroes', async () => {
        fillInput('0000')

        await expectValue('Value: 0')
      })
    })

    it('random input test', async () => {
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
