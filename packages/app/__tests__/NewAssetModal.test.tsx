import { screen, waitFor } from '@testing-library/react'
import React from 'react'

import { NewAssetModal } from '../components'
import { useToggle } from '../utils'
import {
  assertButtonNotDisabled,
  assertInputError,
  assertInputValue,
  assertNoInputError,
  assertNoText,
  assertText,
  assertTextInput,
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

describe('New asset modal', () => {
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
      it('accepts only unique id values', async () => {
        fillInput('Asset ID', mockUseAssets[0].id)

        await assertInputError('Asset ID', 'Value cannot match an already-existing asset id.')
      })
    })

    describe('Asset decimals', () => {
      beforeEach(() => {
        fillFirstStep()
      })

      it('allows 0', () => {
        fillInput('Asset decimals', '0')

        assertInputValue('Asset decimals', '0')
        assertButtonNotDisabled('Next')
      })

      it('does not accept decimals', async () => {
        clearInput('Asset decimals')
        typeInInput('Asset decimals', '1.5')

        assertInputValue('Asset decimals', '15')
      })
    })
  })
})
