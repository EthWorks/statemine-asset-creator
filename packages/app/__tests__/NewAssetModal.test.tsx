import type { RenderResult } from '@testing-library/react'
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces'
import type { ErrorDetails, UseTransaction } from 'use-substrate'

import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import BN from 'bn.js'
import React from 'react'

import { TransactionStatus } from 'use-substrate'

import { NewAssetModal } from '../components'
import { TransactionInfoBlockStatus } from '../components/TransactionInfoBlock/TransactionInfoBlock'
import { BN_ZERO as MOCK_BN_ZERO, useToggle } from '../utils'
import {
  assertButtonDisabled,
  assertButtonNotDisabled,
  assertInput,
  assertInputError,
  assertInputValue,
  assertModalClosed,
  assertNoInputError,
  assertText,
  assertTextInAccountSelect,
  clickButton,
  clickByText,
  fillInput,
  findAndClickButton,
  getAccountSelect,
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
  mockUseBalances,
  mockUseBalancesConstants,
  mockUseChainToken,
  mockUseCreateAssetDeposit
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

const FEE = '30000000000'
const mockTransaction = jest.fn()
let mockUseTransaction: UseTransaction = { tx: mockTransaction, paymentInfo: { partialFee: new BN(FEE) } as RuntimeDispatchInfo, status: TransactionStatus.Ready }
const mockTeleport = jest.fn()
let mockUseTeleport: UseTransaction = { tx: mockTeleport, paymentInfo: { partialFee: new BN(FEE) } as RuntimeDispatchInfo, status: TransactionStatus.Ready }
const ASSET_ID = '7'
const MIN_BALANCE = '300'
const ASSET_NAME = 'kusama'
const ASSET_SYMBOL = 'KSM'
const ASSET_DECIMALS = '18'
const ALICE_ACCOUNT_INDEX = 0
const BOB_ACCOUNT_INDEX = 1
const OWNER_DROPDOWN_INDEX = 0
const ADMIN_DROPDOWN_INDEX = 1
const ISSUER_DROPDOWN_INDEX = 2
const FREEZER_DROPDOWN_INDEX = 3

const mockEmptyBalance = {
  availableBalance: MOCK_BN_ZERO,
  freeBalance: MOCK_BN_ZERO,
  lockedBalance: MOCK_BN_ZERO,
  reservedBalance: MOCK_BN_ZERO,
  accountNonce: 1
}

const mockedUseBalances = (address: string) => {
  switch (address) {
    case aliceAccount.address:
      return mockEmptyBalance
    default:
      return mockUseBalances
  }
}

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useBalances: (account: string) => mockedUseBalances(account),
  useTransaction: () => mockUseTransaction,
  useActiveAccount: () => mockUseActiveAccount,
  useCreateAssetDeposit: () => mockUseCreateAssetDeposit,
  useChainToken: () => mockUseChainToken,
  useBalancesConstants: () => mockUseBalancesConstants,
  useTeleport: () => mockUseTeleport
}))

const mockedStringLimit = mockUseAssetsConstants.stringLimit.toNumber()

describe('New asset modal', () => {
  beforeEach(() => {
    mockTransaction.mockClear()
    setCreateAssetTransactionStatus(TransactionStatus.Ready)
    mockUseApi.api.tx.assets.create.mockClear()
    mockUseApi.api.tx.assets.setMetadata.mockClear()
    mockUseApi.api.tx.assets.setTeam.mockClear()
  })

  describe('Functionality', () => {
    it('saves data in context', async () => {
      renderModal()

      await enterThirdStep()

      await waitFor(() => expect(screen.getByText('Confirm')).toBeTruthy())
      await assertSummary()
    })

    describe('closes modal and resets data', () => {
      beforeEach(async () => {
        renderModal()
        await enterThirdStep()
      })

      it('on confirm', async () => {
        clickButton('Confirm')
        await closeModal()
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

  describe('First step', () => {
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
  })

  describe('Second step', () => {
    it('shows owner account', async () => {
      renderModal()
      await enterSecondStep()

      const ownerAccountSelect = await getAccountSelect(OWNER_DROPDOWN_INDEX)
      expect(ownerAccountSelect).toHaveAttribute('disabled')
      await assertTextInAccountSelect('BOB', OWNER_DROPDOWN_INDEX)
    })

    describe('shows insufficient funds info', () => {
      beforeEach(async () => {
        renderModal()
        await enterSecondStep()

        await assertText('Owner account')
      })

      it('for one account', async () => {
        await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await assertTextInAccountSelect('ALICE', ADMIN_DROPDOWN_INDEX)
        await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
        await assertTextInAccountSelect('BOB', ISSUER_DROPDOWN_INDEX)
        await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
        await assertTextInAccountSelect('BOB', FREEZER_DROPDOWN_INDEX)

        const infobox = await screen.findByTestId('infobox')

        expect(infobox).toHaveTextContent('Insufficient funds on the Admin account to create assets.')
      })

      it('for two accounts', async () => {
        await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await assertTextInAccountSelect('ALICE', ADMIN_DROPDOWN_INDEX)
        await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await assertTextInAccountSelect('ALICE', ISSUER_DROPDOWN_INDEX)
        await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
        await assertTextInAccountSelect('BOB', FREEZER_DROPDOWN_INDEX)

        const infobox = await screen.findByTestId('infobox')

        expect(infobox).toHaveTextContent('Insufficient funds on the Admin and Issuer accounts to create assets.')
      })

      it('for three accounts', async () => {
        await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await assertTextInAccountSelect('ALICE', ADMIN_DROPDOWN_INDEX)
        await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await assertTextInAccountSelect('ALICE', ISSUER_DROPDOWN_INDEX)
        await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await assertTextInAccountSelect('ALICE', FREEZER_DROPDOWN_INDEX)

        const infobox = await screen.findByTestId('infobox')

        expect(infobox).toHaveTextContent('Insufficient funds on the Admin, Issuer and Freezer accounts to create assets.')
      })
    })

    describe('allows to select account for', () => {
      beforeEach(async () => {
        renderModal()
        await enterSecondStep()
      })

      it('admin', async () => {
        await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        clickButton('Next')
        await findAndClickButton('Confirm')

        expect(mockUseApi.api.tx.assets.create).toBeCalledWith(ASSET_ID, aliceAccount.address, MIN_BALANCE)
        expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(ASSET_ID, bobAccount.address, aliceAccount.address, bobAccount.address)
      })

      it('issuer', async () => {
        await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        clickButton('Next')
        await act(() => findAndClickButton('Confirm'))

        expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(ASSET_ID, aliceAccount.address, bobAccount.address, bobAccount.address)
      })

      it('freezer', async () => {
        await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        clickButton('Next')
        await act(() => findAndClickButton('Confirm'))

        expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(ASSET_ID, bobAccount.address, bobAccount.address, aliceAccount.address)
      })
    })

    describe('Use everywhere', () => {
      it('sets admin account for issuer and freezer account', async () => {
        renderModal()
        await enterSecondStep()

        await assertTextInAccountSelect(bobAccount.name, ADMIN_DROPDOWN_INDEX)
        await assertTextInAccountSelect(bobAccount.name, ISSUER_DROPDOWN_INDEX)
        await assertTextInAccountSelect(bobAccount.name, FREEZER_DROPDOWN_INDEX)

        await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        await clickByText('Use everywhere')

        await assertTextInAccountSelect(aliceAccount.name, ISSUER_DROPDOWN_INDEX)
        await assertTextInAccountSelect(aliceAccount.name, FREEZER_DROPDOWN_INDEX)
      })
    })
  })

  describe('Third step', () => {
    describe('account has statemine funds', () => {
      it('sends transaction on confirm', async () => {
        renderModal()
        await createAsset()

        expect(mockUseApi.api.tx.assets.create).toBeCalledWith(ASSET_ID, bobAccount.address, MIN_BALANCE)
        expect(mockUseApi.api.tx.assets.setMetadata).toBeCalledWith(ASSET_ID, ASSET_NAME, ASSET_SYMBOL, ASSET_DECIMALS)
        expect(mockUseApi.api.tx.assets.setTeam).not.toBeCalled()
      })

      describe('displays content', () => {
        it('for create asset transaction', async () => {
          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'ChainStatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })
      })

      describe('displays content, steps bar and confirm button', () => {
        it('Ready', async () => {
          renderModal()
          await enterThirdStep()

          assertStepsBarVisible()
          assertContentVisible()

          assertButtonNotDisabled('Confirm')
        })

        it('AwaitingSign', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.AwaitingSign)

          renderModal()
          await enterThirdStep()

          assertStepsBarVisible()
          assertContentVisible()

          assertButtonDisabled('Confirm')
          assertButtonDisabled('Back')

          await assertTransactionInfoBlock(1, 'sign', [
            'ChainStatemine',
            'Statemine fee0.0300KSM'
          ])
        })
      })

      describe('hides content and shows pending transaction for ongoing transaction', () => {
        it('InBlock', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.InBlock)

          renderModal()
          await enterThirdStep()

          assertStepsBarHidden()
          assertContentHidden()

          const modalContent = screen.getByTestId('status-step-InBlock')
          expect(modalContent).toHaveTextContent('Pending transaction 1/1...')
          expect(modalContent).toHaveTextContent('Transaction #1')
          expect(modalContent).toHaveTextContent('Asset Creation')
          expect(modalContent).toHaveTextContent('It takes time to create your asset. In order to do so, we need to create a transaction and wait until blockchain validates it.')
        })

        it('Success', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.Success)

          renderModal()
          await enterThirdStep()

          assertStepsBarHidden()
          assertContentHidden()

          const modalContent = screen.getByTestId('status-step-Success')
          expect(modalContent).toHaveTextContent('Congratulations!')
          expect(modalContent).toHaveTextContent('Your asset have been created.')
          assertButtonNotDisabled('View asset in explorer')
          assertButtonNotDisabled('Back to dashboard')
        })

        describe('Error', () => {
          it('with error details', async () => {
            setErrorDetails([
              errorDetail({ section: 'assets', name: 'BadMetadata', docs: ['Invalid metadata given.'] })
            ])

            renderModal()
            await enterThirdStep()

            assertStepsBarHidden()
            assertContentHidden()

            const modalContent = screen.getByTestId('status-step-Error')
            expect(modalContent).toHaveTextContent('Something went wrong')
            expect(modalContent).toHaveTextContent('[assets.BadMetadata]: Invalid metadata given.')
            assertButtonNotDisabled('Back to dashboard')
          })

          it('with missing error details', async () => {
            setErrorDetails(undefined)

            renderModal()
            await enterThirdStep()

            assertStepsBarHidden()
            assertContentHidden()

            const modalContent = screen.getByTestId('status-step-Error')
            expect(modalContent).toHaveTextContent('Something went wrong')
            expect(modalContent).toHaveTextContent('Unknown error.')
            assertButtonNotDisabled('Back to dashboard')
          })

          it('with missing error section', async () => {
            setErrorDetails([
              errorDetail({ name: 'BadMetadata', docs: ['Invalid metadata given.'] })
            ])

            renderModal()
            await enterThirdStep()

            assertStepsBarHidden()
            assertContentHidden()

            const modalContent = screen.getByTestId('status-step-Error')
            expect(modalContent).toHaveTextContent('Something went wrong')
            expect(modalContent).toHaveTextContent('[BadMetadata]: Invalid metadata given.')
            assertButtonNotDisabled('Back to dashboard')
          })

          it('with missing docs', async () => {
            setErrorDetails([
              errorDetail({ section: 'assets', name: 'BadMetadata' })
            ])

            renderModal()
            await enterThirdStep()

            assertStepsBarHidden()
            assertContentHidden()

            const modalContent = screen.getByTestId('status-step-Error')
            expect(modalContent).toHaveTextContent('Something went wrong')
            expect(modalContent).toHaveTextContent('[assets.BadMetadata]')
            assertButtonNotDisabled('Back to dashboard')
          })

          it('with missing error name', async () => {
            setErrorDetails([
              errorDetail({ section: 'assets', name: undefined, docs: ['Invalid metadata given.'] })
            ])

            renderModal()
            await enterThirdStep()

            assertStepsBarHidden()
            assertContentHidden()

            const modalContent = screen.getByTestId('status-step-Error')
            expect(modalContent).toHaveTextContent('Something went wrong')
            expect(modalContent).toHaveTextContent('[assets]: Invalid metadata given.')
            assertButtonNotDisabled('Back to dashboard')
          })

          it('with multiple error details', async () => {
            setErrorDetails([
              errorDetail({ section: 'assets', name: 'BadMetadata', docs: ['Invalid metadata given.'] }),
              errorDetail({ section: 'assets', name: 'InUse', docs: ['The asset ID is already taken.'] })
            ])

            renderModal()
            await enterThirdStep()

            assertStepsBarHidden()
            assertContentHidden()

            const modalContent = screen.getByTestId('status-step-Error')
            expect(modalContent).toHaveTextContent('Something went wrong')
            expect(modalContent).toHaveTextContent('[assets.BadMetadata]: Invalid metadata given.')
            expect(modalContent).toHaveTextContent('[assets.InUse]: The asset ID is already taken.')
            assertButtonNotDisabled('Back to dashboard')
          })
        })

        it('enables to go back to dashboard', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.Success)

          renderModal()
          await enterThirdStep()

          clickButton('Back to dashboard')
          assertModalClosed()

          clickButton('Create new asset')
          assertFirstStepEmpty()
        })
      })
    })

    describe('proposes kusama teleport if account has insufficient funds', () => {
      describe('displays transaction info', () => {
        it('when statemine account has zero funds', async () => {
          mockUseBalances.availableBalance = new BN(0)
          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'ChainKusamaStatemine',
            'Teleport amount140.0310KSM'
          ])

          await assertTransactionInfoBlock(2, 'ready', [
            'ChainStatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })

        it('when statemine account has less funds than needed', async () => {
          mockUseBalances.availableBalance = mockUseBalancesConstants.existentialDeposit
          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'ChainKusamaStatemine',
            'Teleport amount140.0310KSM'
          ])

          await assertTransactionInfoBlock(2, 'ready', [
            'ChainStatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })

        it('after successful teleport', async () => {
          mockUseBalances.availableBalance = mockUseBalancesConstants.existentialDeposit
          setTeleportTransactionStatus(TransactionStatus.Success)

          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'done', [])

          await assertTransactionInfoBlock(2, 'ready', [
            'ChainStatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })
      })

      describe('executes teleport transaction', () => {
        beforeAll(() => {
          mockUseBalances.availableBalance = new BN(0)
        })

        it('hides content and shows pending transaction modal for ongoing transaction', async () => {
          setTeleportTransactionStatus(TransactionStatus.InBlock)

          renderModal()
          await enterThirdStep()

          assertStepsBarHidden()
          assertContentHidden()

          const modalContent = screen.getByTestId('status-step-InBlock')
          expect(modalContent).toHaveTextContent('Pending transaction 1/2...')
          expect(modalContent).toHaveTextContent('Transaction #1')
          expect(modalContent).toHaveTextContent('Teleport')
          expect(modalContent).toHaveTextContent('It takes time to teleport. In order to do so, we need to create a transaction and wait until blockchain validates it.')
        })

        it('hides content and shows error modal when transaction was rejected', async () => {
          setTeleportErrorDetails([
            errorDetail({ section: 'Unknown', name: 'Subscription error', docs: undefined })
          ])

          renderModal()
          await enterThirdStep()

          assertStepsBarHidden()
          assertContentHidden()

          const modalContent = screen.getByTestId('status-step-Error')
          expect(modalContent).toHaveTextContent('Something went wrong')
          expect(modalContent).toHaveTextContent('[Unknown.Subscription error]')
          assertButtonNotDisabled('Back to dashboard')
        })
      })
    })
  })
})

const renderModal = (): RenderResult => {
  return renderWithTheme(<TestComponent/>)
}

const fillFirstStep = (): void => {
  fillInput('Asset name', ASSET_NAME)
  fillInput('Asset symbol', ASSET_SYMBOL)
  fillInput('Asset decimals', ASSET_DECIMALS)
  fillInput('Asset ID', ASSET_ID)
  fillInput('Minimum balance', MIN_BALANCE)
}

const fillSecondStep = async (): Promise<void> => {
  await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
  await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
  await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
}

const clearInput = (inputName: string) => {
  fillInput(inputName, '')
}
const assertFirstStepFilled = () => {
  assertInput('Asset name', ASSET_NAME)
  assertInput('Asset symbol', ASSET_SYMBOL)
  assertInput('Asset decimals', ASSET_DECIMALS)
  assertInput('Asset ID', ASSET_ID)
  assertInput('Minimum balance', MIN_BALANCE)
}

const assertFirstStepEmpty = () => {
  assertInput('Asset name', '')
  assertInput('Asset symbol', '')
  assertInput('Asset decimals', '')
  assertInput('Asset ID', '')
  assertInput('Minimum balance', '')
}

const assertSummary = async () => {
  const assetModal = await screen.getByTestId('modal')
  expect(assetModal).toHaveTextContent(`Asset name${ASSET_NAME}`)
  expect(assetModal).toHaveTextContent(`Asset symbol${ASSET_SYMBOL}`)
  expect(assetModal).toHaveTextContent(`Asset decimals${ASSET_DECIMALS}`)
  expect(assetModal).toHaveTextContent(`Asset minimal balance${MIN_BALANCE}`)
  expect(assetModal).toHaveTextContent(`Asset id${ASSET_ID}`)
}

const createAsset = async (): Promise<void> => {
  await openModal()

  fillFirstStep()
  clickButton('Next')
  await fillSecondStep()

  clickButton('Next')
  await act(async () => await findAndClickButton('Confirm'))
}

const enterThirdStep = async (): Promise<void> => {
  await openModal()

  fillFirstStep()
  clickButton('Next')
  await fillSecondStep()

  clickButton('Next')
}

const enterSecondStep = async () => {
  await openModal()
  await fillFirstStep()
  clickButton('Next')
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

const assertStepsBarHidden = () => {
  const stepBar = screen.queryAllByTestId('steps-bar')
  expect(stepBar).toHaveLength(0)
}

const assertContentHidden = () => {
  const thirdStepContent = screen.queryAllByTestId('third-step-content')
  expect(thirdStepContent).toHaveLength(0)
}

const assertStepsBarVisible = () => {
  const stepBar = screen.queryAllByTestId('steps-bar')
  expect(stepBar).toHaveLength(1)
}

const assertContentVisible = () => {
  const thirdStepContent = screen.queryAllByTestId('third-step-content')
  expect(thirdStepContent).toHaveLength(1)
}

interface TestErrorDetails {
  section?: string;
  name?: string;
  docs?: string[];
}

const setCreateAssetTransactionStatus = (status: TransactionStatus) => {
  mockUseTransaction = {
    ...mockUseTransaction,
    status
  }
}

const setTeleportTransactionStatus = (status: TransactionStatus) => {
  mockUseTeleport = {
    ...mockUseTeleport,
    status
  }
}

const setErrorDetails = (errorDetails: ErrorDetails[] | undefined) => {
  mockUseTransaction = {
    ...mockUseTransaction,
    status: TransactionStatus.Error,
    errorDetails
  }
}

const setTeleportErrorDetails = (errorDetails: ErrorDetails[] | undefined) => {
  mockUseTeleport = {
    ...mockUseTeleport,
    status: TransactionStatus.Error,
    errorDetails
  }
}

const errorDetail = ({ section = '', name = '', docs = [] }: TestErrorDetails): ErrorDetails => ({
  section,
  name,
  docs
})

const assertTransactionInfoBlock = async (transactionNumber: number, status: TransactionInfoBlockStatus, content: string[]) => {
  const transactionInfoBlock = await screen.findByTestId(`transaction-info-block-${transactionNumber}-${status}`)

  content.forEach(text => expect(transactionInfoBlock).toHaveTextContent(text))
}
