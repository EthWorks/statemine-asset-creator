import { screen, waitFor } from '@testing-library/react'
import React from 'react'

import { NewAssetModal } from '../components'
import { useToggle } from '../utils'
import {
  assertButtonDisabled,
  assertButtonNotDisabled,
  assertInputError,
  assertInputValue,
  assertNoInputError,
  assertText,
  assertTextInput,
  clickButton,
  fillInput,
  findAndClickButton,
  renderWithTheme,
  typeInInput,
} from './helpers'
import { mockChains, mockUseActiveAccounts, mockUseApi, mockUseAssets, mockUseAssetsConstants } from './mocks'

function TestComponent(): JSX.Element {
  const [isOpen, toggleOpen] = useToggle()

  return (
    <>
      {!isOpen && <button onClick={toggleOpen}>Create new asset</button>}
      <NewAssetModal isOpen={isOpen} closeModal={toggleOpen}/>
    </>
  )
}

const mockTransaction = jest.fn()
const mockUseTransaction = { tx: mockTransaction, paymentInfo: {} }

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useTransaction: () => mockUseTransaction,
  Chains: () => mockChains,
  useActiveAccounts: () => mockUseActiveAccounts
}))

const mockedStringLimit = mockUseAssetsConstants.stringLimit.toNumber()

describe('New asset modal', () => {
  beforeEach(() => {
    mockTransaction.mockClear()
  })

  it('saves data in context', async () => {
    renderModal()

    clickButton('Create new asset')

    fillFirstStep()
    clickButton('Next')

    await waitFor(() => expect(screen.getByText('Confirm')).toBeTruthy())
    await assertText('kusama')
    await assertText('KSM')
    await assertText('18')
    await assertText('7')
    await assertText('300')
  })

  it('closes modal and resets data on confirm', async () => {
    renderModal()
    fillAllForms()

    await findAndClickButton('Create new asset')

    await assertText('Create asset')
    assertTextInput('Asset name', '')
    assertTextInput('Asset symbol', '')
    assertTextInput('Asset decimals', '')
    assertTextInput('Asset ID', '')
  })

  it('sends transaction on confirm', async () => {
    renderModal()
    fillAllForms()

    await waitFor(() => expect(mockTransaction).toBeCalled())
  })

  describe('validates inputs', () => {
    beforeEach(() => {
      renderModal()
      clickButton('Create new asset')
      fillFirstStep()
      assertButtonNotDisabled('Next')
    })

    describe('Disables Next button when input is empty', () => {
      ;['Asset name', 'Asset symbol', 'Asset ID', 'Asset decimals', 'Minimum balance'].forEach(inputName => {
        it(`for ${inputName}`, async () => {
          fillInput(inputName, '')

          assertButtonDisabled('Next')
        })
      })
    })

    ;['Asset name', 'Asset symbol'].forEach(inputName => {
      describe(inputName, () => {
        it('does not allow to exceed StringLimit', async () => {
          fillInput(inputName, 'a'.repeat(mockedStringLimit + 1))
          await assertInputError(inputName, `Maximum length of ${mockedStringLimit} characters exceeded`)

          assertButtonDisabled('Next')
        })

        it('does not display error when asset name length decreased', async () => {
          fillInput(inputName, 'a'.repeat(mockedStringLimit + 1))
          await assertInputError(inputName, `Maximum length of ${mockedStringLimit} characters exceeded`)

          assertButtonDisabled('Next')

          fillInput(inputName, 'a'.repeat(mockedStringLimit))
          await assertNoInputError(inputName)

          assertButtonNotDisabled('Next')
        })
      })
    })

    describe('Asset id', () => {
      it('accepts only unique id values', async () => {
        fillInput('Asset ID', mockUseAssets[0].id)

        await assertInputError('Asset ID', 'Value cannot match an already-existing asset id.')
        assertButtonDisabled('Next')
      })
    })

    describe('Asset decimals', () => {
      beforeEach(() => {
        fillFirstStep()
        clearInput('Asset decimals')
      })

      it('allows 0', () => {
        fillInput('Asset decimals', '0')

        assertInputValue('Asset decimals', '0')
        assertButtonNotDisabled('Next')
      })

      it('does not accept decimals', async () => {
        typeInInput('Asset decimals', '1.5')

        assertInputValue('Asset decimals', '15')
      })
    })
  })

  describe('step bar', () => {
    it('sets proper styles', async () => {
      renderModal()

      clickButton('Create new asset')
      await assertSteps(['active', 'unvisited', 'unvisited', 'unvisited'])

      fillFirstStep()
      clickButton('Next')

      await assertSteps(['past', 'active', 'unvisited', 'unvisited'])
    })
  })
})

const renderModal = (): void => {
  renderWithTheme(<TestComponent/>)
}

const fillFirstStep = (): void => {
  fillInput('Asset name', 'kusama')
  fillInput('Asset symbol', 'KSM')
  fillInput('Asset decimals', '18')
  fillInput('Asset ID', '7')
  fillInput('Minimum balance', '300')
}

const fillAllForms = (): void => {
  clickButton('Create new asset')

  fillFirstStep()
  clickButton('Next')

  clickButton('Confirm')
}

const clearInput = (inputName: string) => {
  fillInput(inputName, '')
}

async function assertSteps(expectedSteps: ('active' | 'past' | 'unvisited')[]) {
  await Promise.all(expectedSteps.map(async (step, index) => {
    if (step === 'active') {
      await assertStepActive(index)
    }
    else if (step === 'past') {
      await assertStepPast(index)
    }
    else {
      await assertStepUnvisited(index)
    }
  }))
}

async function assertStepActive(stepIndex : number) {
  const step = await screen.findByTestId('step-' + stepIndex)
  expect(step).toHaveClass('active')
  expect(step).not.toHaveClass('past')
}

async function assertStepUnvisited(stepIndex : number) {
  const step = await screen.findByTestId('step-' + stepIndex)
  expect(step).not.toHaveClass('active')
  expect(step).not.toHaveClass('past')
}

async function assertStepPast(stepIndex: number) {
  const step = await screen.findByTestId('step-' + stepIndex)
  expect(step).toHaveClass('past')
  expect(step).not.toHaveClass('active')
}
