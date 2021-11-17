import { screen, waitFor } from '@testing-library/react'
import React from 'react'

import { NewAssetModal } from '../components'
import { useToggle } from '../utils'
import {
  assertInputError,
  assertNoInputError,
  assertNoText,
  assertText,
  assertTextInput,
  clickButton,
  fillInput,
  findAndClickButton,
  renderWithTheme,
  setLocalStorage
} from './helpers'
import { bobAccount, mockChains, mockUseApi, mockUseAssets, mockUseAssetsConstants } from './mocks'

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
}

const fillAllForms = (): void => {
  clickButton('Create new asset')

  fillFirstStep()
  clickButton('Next')

  clickButton('Confirm')
}

const mockTransaction = jest.fn()
const mockUseTransaction = { tx: mockTransaction, paymentInfo: {} }

jest.mock('use-substrate', () => ({
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useTransaction: () => mockUseTransaction,
  Chains: () => mockChains
}))

const mockedStringLimit = mockUseAssetsConstants.stringLimit.toNumber()

describe('New asset modal', () => {
  beforeEach(function () {
    setLocalStorage('activeAccount', bobAccount.address)
  })

  afterEach(function () {
    localStorage.clear()
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

  it('sends transaction on confirm',  async () => {
    renderModal()
    fillAllForms()

    await waitFor(() => expect(mockTransaction).toBeCalled())
  })

  describe('validates inputs', () => {
    beforeEach(() => {
      renderModal()
      clickButton('Create new asset')
      fillFirstStep()
    })

    ;['Asset name', 'Asset symbol'].forEach(inputName => {
      describe(inputName, () => {
        it('does not allow to exceed StringLimit', async () => {
          fillInput(inputName, 'a'.repeat(mockedStringLimit + 1))
          await assertInputError(inputName, `Maximum length of ${mockedStringLimit} characters exceeded`)

          clickButton('Next')
          assertNoText('Confirm')
        })

        it('does not display error when asset name length decreased', async () => {
          fillInput(inputName, 'a'.repeat(mockedStringLimit + 1))
          await assertInputError(inputName, `Maximum length of ${mockedStringLimit} characters exceeded`)

          fillInput(inputName, 'a'.repeat(mockedStringLimit))
          await assertNoInputError(inputName)

          clickButton('Next')
          await assertText('Confirm')
        })
      })
    })

    describe('Asset id', () => {
      it('does not allow non numeric values', async () => {
        fillInput('Asset ID', 'invalid')

        await assertInputError('Asset ID', 'Value must be a positive number')
      })

      it('allows numeric inputs', async () => {
        fillInput('Asset ID', 100)

        assertNoInputError('Asset ID')
      })

      it('allows only positive numbers', async () => {
        fillInput('Asset ID', -1)

        await assertInputError('Asset ID', 'Value must be a positive number')
      })

      it('accepts only unique id values', async () => {
        fillInput('Asset ID', mockUseAssets[0].id)

        await assertInputError('Asset ID', 'Value cannot match an already-existing asset id.')
      })
    })
  })
})
