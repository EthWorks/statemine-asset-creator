import { act, fireEvent, screen, waitFor } from '@testing-library/react'
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
  selectAccountFromDropdown,
  typeInInput
} from './helpers'
import {
  aliceAccount,
  bobAccount,
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseApi,
  mockUseAssets,
  mockUseAssetsConstants,
  mockUseBalances
} from './mocks'

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
const assetId = '7'
const minBalance = '300'
const assetName = 'kusama'
const assetSymbol = 'KSM'
const assetDecimals = '18'
const aliceAccountIndex = 0
const bobAccountIndex = 1
const adminDropdownIndex = 0
const isserDropdownIndex = 1
const freezerDropdownIndex = 2

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useBalances: () => mockUseBalances,
  useTransaction: () => mockUseTransaction,
  useActiveAccount: () => mockUseActiveAccount
}))

const mockedStringLimit = mockUseAssetsConstants.stringLimit.toNumber()

describe('New asset modal', () => {
  beforeEach(() => {
    mockTransaction.mockClear()
    mockUseApi.api.tx.assets.create.mockClear()
    mockUseApi.api.tx.assets.setMetadata.mockClear()
    mockUseApi.api.tx.assets.setTeam.mockClear()
  })

  it('saves data in context', async () => {
    renderModal()

    await openModal()
    fillFirstStep()
    clickButton('Next')
    await fillSecondStep()
    clickButton('Next')

    await waitFor(() => expect(screen.getByText('Confirm')).toBeTruthy())
    await assertSummary()
  })

  describe('closes modal and resets data', () => {
    beforeEach(async () => {
      renderModal()
      await openModal()
      fillFirstStep()
      clickButton('Next')
      await fillSecondStep()
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

  it('allows to go back to first step', async () => {
    renderModal()

    await openModal()
    fillFirstStep()
    await findAndClickButton('Next')
    await screen.findByText('Admin account')
    assertSteps(['past', 'active', 'unvisited', 'unvisited'])

    await findAndClickButton('Back')

    assertFirstStepFilled()
    assertSteps(['active', 'unvisited', 'unvisited', 'unvisited'])
  })

  it('sends transaction on confirm', async () => {
    renderModal()
    await act(async () => await createAsset())

    expect(mockUseApi.api.tx.assets.create).toBeCalledWith(assetId, bobAccount.address, minBalance)
    expect(mockUseApi.api.tx.assets.setMetadata).toBeCalledWith(assetId, assetName, assetSymbol, assetDecimals)
    expect(mockUseApi.api.tx.assets.setTeam).not.toBeCalled()
  })

  describe('validates inputs', () => {
    beforeEach(async () => {
      renderModal()
      await openModal()
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

  describe('allows to select account for', () => {
    beforeEach(async () => {
      renderModal()
      await openModal()
      await fillFirstStep()
      clickButton('Next')
    })

    it('admin', async () => {
      await selectAccountFromDropdown(adminDropdownIndex, aliceAccountIndex)
      clickButton('Next')
      await act(() => findAndClickButton('Confirm'))

      expect(mockUseApi.api.tx.assets.create).toBeCalledWith(assetId, aliceAccount.address, minBalance)
      expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(assetId, bobAccount.address, aliceAccount.address, bobAccount.address)
    })

    it('issuer', async () => {
      await selectAccountFromDropdown(isserDropdownIndex, aliceAccountIndex)
      clickButton('Next')
      await act(() => findAndClickButton('Confirm'))

      expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(assetId, aliceAccount.address, bobAccount.address, bobAccount.address)
    })

    it('freezer', async () => {
      await selectAccountFromDropdown(freezerDropdownIndex, aliceAccountIndex)
      clickButton('Next')
      await act(() => findAndClickButton('Confirm'))

      expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(assetId, bobAccount.address, bobAccount.address, aliceAccount.address)
    })
  })

  describe('step bar', () => {
    it('sets proper styles', async () => {
      renderModal()

      await openModal()
      assertSteps(['active', 'unvisited', 'unvisited', 'unvisited'])

      fillFirstStep()
      clickButton('Next')

      assertSteps(['past', 'active', 'unvisited', 'unvisited'])
    })
  })
})

const renderModal = (): void => {
  renderWithTheme(<TestComponent/>)
}

const fillFirstStep = (): void => {
  fillInput('Asset name', assetName)
  fillInput('Asset symbol', assetSymbol)
  fillInput('Asset decimals', assetDecimals)
  fillInput('Asset ID', assetId)
  fillInput('Minimum balance', minBalance)
}

const fillSecondStep = async (): Promise<void> => {
  await selectAccountFromDropdown(adminDropdownIndex, bobAccountIndex)
  await selectAccountFromDropdown(isserDropdownIndex, bobAccountIndex)
  await selectAccountFromDropdown(freezerDropdownIndex, bobAccountIndex)
}

const clearInput = (inputName: string) => {
  fillInput(inputName, '')
}
const assertFirstStepFilled = () => {
  assertInput('Asset name', assetName)
  assertInput('Asset symbol', assetSymbol)
  assertInput('Asset decimals', assetDecimals)
  assertInput('Asset ID', assetId)
  assertInput('Minimum balance', minBalance)
}

function assertFirstStepEmpty() {
  assertInput('Asset name', '')
  assertInput('Asset symbol', '')
  assertInput('Asset decimals', '')
  assertInput('Asset ID', '')
  assertInput('Minimum balance', '')
}

async function assertSummary() {
  await assertText(assetName)
  await assertText(assetSymbol)
  await assertText(assetDecimals)
  await assertText(assetId)
  await assertText(minBalance)
}

const createAsset = async (): Promise<void> => {
  await openModal()

  fillFirstStep()
  clickButton('Next')
  await fillSecondStep()
  clickButton('Next')

  clickButton('Confirm')
}

const closeModal = async () => {
  const closeButton = await screen.findByTestId('modal-close-button')

  fireEvent.click(closeButton)
}

const openModal = async (): Promise<void> => {
  await findAndClickButton('Create new asset')
}

const assertSteps = (expectedSteps: ('active' | 'past' | 'unvisited')[]) => {
  expectedSteps.map((step, index) => {
    const stepHtmlElement = screen.getByTestId('step-' + index)

    if (step === 'active') {
      assertStepActive(stepHtmlElement)
    } else if (step === 'past') {
      assertStepPast(stepHtmlElement)
    } else {
      assertStepUnvisited(stepHtmlElement)
    }
  })
}

const assertStepActive = (step: HTMLElement) => {
  expect(step).toHaveClass('active')
  expect(step).not.toHaveClass('past')
}

const assertStepUnvisited = (step: HTMLElement) => {
  expect(step).not.toHaveClass('active')
  expect(step).not.toHaveClass('past')
}

const assertStepPast = (step: HTMLElement) => {
  expect(step).toHaveClass('past')
  expect(step).not.toHaveClass('active')
}
