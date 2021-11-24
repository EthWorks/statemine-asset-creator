import { fireEvent, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { NewAssetModal } from '../components'
import { useToggle } from '../utils'
import {
  assertButtonDisabled,
  assertButtonNotDisabled,
  assertInput,
  assertInputError,
  assertInputValue,
  assertNoInputError,
  assertText,
  clickButton,
  fillInput,
  findAndClickButton,
  renderWithTheme,
  typeInInput,
} from './helpers'
import { mockChains, mockUseActiveAccount, mockUseApi, mockUseAssets, mockUseAssetsConstants } from './mocks'

function TestComponent(): JSX.Element {
  const [isOpen, toggleOpen] = useToggle()

  return (
    <>
      {!isOpen && <button onClick={toggleOpen}>Create new asset</button>}
      <NewAssetModal isOpen={isOpen} closeModal={toggleOpen}/>
    </>
  )
}

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

const assertFirstStepFilled = () => {
  assertInput('Asset name', 'kusama')
  assertInput('Asset symbol', 'KSM')
  assertInput('Asset decimals', '18')
  assertInput('Asset ID', '7')
  assertInput('Minimum balance', '300')
}

function assertFirstStepEmpty() {
  assertInput('Asset name', '')
  assertInput('Asset symbol', '')
  assertInput('Asset decimals', '')
  assertInput('Asset ID', '')
  assertInput('Minimum balance', '')
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

const mockTransaction = jest.fn()
const mockUseTransaction = { tx: mockTransaction, paymentInfo: {} }

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useTransaction: () => mockUseTransaction,
  Chains: () => mockChains,
  useActiveAccount: () => mockUseActiveAccount
}))

const mockedStringLimit = mockUseAssetsConstants.stringLimit.toNumber()

const closeModal = async () => {
  const closeButton = await screen.findByTestId('modal-close-button')

  fireEvent.click(closeButton)
}

async function openModal() {
  await findAndClickButton('Create new asset')
}

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

  describe('closes modal and resets data', () => {
    beforeEach(async () => {
      renderModal()
      await openModal()
      fillFirstStep()
      clickButton('Next')
    })
    
    it('on confirm', async () => {
      clickButton('Confirm')
      await openModal()
      
      await assertText('Create asset')
      assertFirstStepEmpty()
    })
    
    it('on close', async () => {
      await closeModal()
      await openModal()

      await assertText('Create asset')
      assertFirstStepEmpty()
    })
  })
 
  it('allows to go back to first step', () => {
    renderModal()

    clickButton('Create new asset')

    fillFirstStep()
    clickButton('Next')
    clickButton('Back')

    assertFirstStepFilled()
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
})
