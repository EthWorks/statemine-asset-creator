import type { RenderResult } from '@testing-library/react'
import type { RuntimeDispatchInfo } from '@polkadot/types/interfaces'
import type { ErrorDetails, UseActiveAccount, UseTransaction } from 'use-substrate'

import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BN from 'bn.js'
import React from 'react'

import { Chains, TransactionStatus } from 'use-substrate'

import { ChainSwitcher, NewAssetModal } from '../components'
import { formatBalance } from '../components/FormatBalance/utils'
import { DECIMALS_LIMIT } from '../components/NewAssetModal/FirstStep'
import { TransactionInfoBlockStatus } from '../components/TransactionInfoBlock/TransactionInfoBlock'
import { AppChainsProvider, BN_ZERO as MOCK_BN_ZERO, useToggle } from '../utils'
import {
  assertButtonDisabled,
  assertButtonNotDisabled,
  assertInfobox,
  assertInput,
  assertInputError,
  assertInputHint,
  assertInputValue,
  assertModalClosed,
  assertNewTabOpened,
  assertNoInfobox,
  assertNoInputError,
  assertText,
  assertTextInAccountSelect,
  clickButton,
  clickByText,
  fillInput,
  findAndClickButton,
  getAccountSelect,
  renderWithTheme,
  selectAccountFromDropdown, switchApiTo,
  typeInInput
} from './helpers'
import {
  aliceAccount, aliceActiveAccount,
  bobAccount, bobActiveAccount,
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

const openAccountSelectModal = jest.fn()

function TestComponent(): JSX.Element {
  const [isOpen, toggleOpen] = useToggle()

  return (
    <>
      <ChainSwitcher/>
      {!isOpen && <button onClick={toggleOpen}>Create new asset</button>}
      <NewAssetModal
        isOpen={isOpen}
        closeModal={toggleOpen}
        openAccountSelectModal={openAccountSelectModal}
      />
    </>
  )
}
const FEE = new BN('30000000000')
const EXPECTED_TELEPORT_AMOUNT = mockUseBalancesConstants.existentialDeposit.add(FEE).add(mockUseCreateAssetDeposit)
const mockTransaction = jest.fn()
let mockUseTransaction: UseTransaction = { tx: mockTransaction, paymentInfo: { partialFee: FEE } as RuntimeDispatchInfo, status: TransactionStatus.Ready }
const mockTeleport = jest.fn()
let mockUseTeleport: UseTransaction = { tx: mockTeleport, paymentInfo: { partialFee: FEE } as RuntimeDispatchInfo, status: TransactionStatus.Ready }
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

let mockActiveAccount: (chain?: Chains) => UseActiveAccount = () => mockUseActiveAccount

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useBalances: (account: string) => mockedUseBalances(account),
  useTransaction: () => mockUseTransaction,
  useActiveAccount: (chain: Chains) => mockActiveAccount(chain),
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

      await screen.findByText('Confirm')
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
      assertSteps(['past', 'active', 'unvisited'])

      await findAndClickButton('Back')

      assertFirstStepFilled()
      assertSteps(['active', 'unvisited', 'unvisited'])
    })

    describe('step bar', () => {
      it('sets proper styles', async () => {
        renderModal()

        await openModal()
        assertSteps(['active', 'unvisited', 'unvisited'])

        fillFirstStep()
        clickButton('Next')

        assertSteps(['past', 'active', 'unvisited'])
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
            assertNoInputError(inputName)

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

        it('shows error and disables next button when exceeded decimals limit', async () => {
          typeInInput('Asset decimals', (DECIMALS_LIMIT + 1).toString())

          await assertInputError('Asset decimals', 'Value too large')
          assertButtonDisabled('Next')
        })
      })

      describe('Minimum balance', () => {
        beforeEach(() => {
          fillFirstStep()
          clearInput('Minimum balance')
        })

        it('shows error and disables next button for value "0"', async () => {
          fillInput('Minimum balance', '0')

          await assertInputError('Minimum balance', 'Non-zero value expected')
          assertButtonDisabled('Next')
        })

        it('does not allow decimals', async () => {
          typeInInput('Minimum balance', '1.00')

          assertInputValue('Minimum balance', '100')
          assertButtonNotDisabled('Next')
        })

        it('does not show error and disables next button for no value in the input', async () => {
          fillInput('Minimum balance', '')

          assertNoInputError('Minimum balance')
          assertButtonDisabled('Next')
        })
      })
    })

    it('shows hint on asset decimals input', async () => {
      renderModal()
      await openModal()

      await assertInputHint('Asset decimals', `Max allowed value is ${DECIMALS_LIMIT}`)
    })

    describe('asset id input', () => {
      const RANDOM_NUMBER = 0.123456789
      const EXPECTED_ID = 123
      const ID_IN_USE = 0.009

      afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore()
      })

      it('generates random asset id', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(RANDOM_NUMBER)

        renderModal()
        await openModal()

        expect(global.Math.random).toHaveBeenCalledTimes(0)
        await findAndClickButton('Generate random ID')
        expect(global.Math.random).toHaveBeenCalledTimes(1)
        assertInputValue('Asset ID', `${EXPECTED_ID}`)
      })

      it('generates again if asset id is already in use', async () => {
        jest.spyOn(global.Math, 'random').mockReturnValueOnce(ID_IN_USE).mockReturnValueOnce(RANDOM_NUMBER)

        renderModal()
        await openModal()

        expect(global.Math.random).toHaveBeenCalledTimes(0)
        await findAndClickButton('Generate random ID')
        expect(global.Math.random).toHaveBeenCalledTimes(2)

        assertInputValue('Asset ID', `${EXPECTED_ID}`)
      })
    })

    describe('input tooltips', () => {
      it('Asset name', async () => {
        renderModal()
        await openModal()

        await hoverInputTooltip('Asset name')
        await assertTooltipText('The descriptive name for this asset, e.g. "Kusama", "Polkadot"')
      })

      it('Asset symbol', async () => {
        renderModal()
        await openModal()

        await hoverInputTooltip('Asset symbol')
        await assertTooltipText('The symbol that will represent this asset, e.g. "KSM", "DOT"')
      })

      it('Asset decimals', async () => {
        renderModal()
        await openModal()

        await hoverInputTooltip('Asset decimals')
        await assertTooltipText('The number of decimal places for this Asset.')
      })

      it('Asset ID', async () => {
        renderModal()
        await openModal()

        await hoverInputTooltip('Asset ID')
        await assertTooltipText('The selected id for the asset. This cannot match an already-existing asset id.')
      })

      it('Minimum balance', async () => {
        renderModal()
        await openModal()

        await hoverInputTooltip('Minimum balance')
        await assertTooltipText('The minimum balance for the asset. This is specified in the units and decimals as requested')
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

    describe('insufficient funds infobox', () => {
      describe('shows for', () => {
        beforeEach(async () => {
          renderModal()
          await enterSecondStep()

          await assertText('Owner account')
        })

        it('one account', async () => {
          await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
          await assertTextInAccountSelect('ALICE', ADMIN_DROPDOWN_INDEX)
          await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
          await assertTextInAccountSelect('BOB', ISSUER_DROPDOWN_INDEX)
          await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
          await assertTextInAccountSelect('BOB', FREEZER_DROPDOWN_INDEX)

          await assertInfobox('The Admin account is low on funds. It may not be able to perform its tasks until topped up.')
        })

        it('two accounts', async () => {
          await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
          await assertTextInAccountSelect('ALICE', ADMIN_DROPDOWN_INDEX)
          await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
          await assertTextInAccountSelect('ALICE', ISSUER_DROPDOWN_INDEX)
          await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, BOB_ACCOUNT_INDEX)
          await assertTextInAccountSelect('BOB', FREEZER_DROPDOWN_INDEX)

          await assertInfobox('The Admin and Issuer accounts are low on funds. They may not be able to perform their tasks until topped up.')
        })

        it('three accounts', async () => {
          await selectAccountFromDropdown(ADMIN_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
          await assertTextInAccountSelect('ALICE', ADMIN_DROPDOWN_INDEX)
          await selectAccountFromDropdown(ISSUER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
          await assertTextInAccountSelect('ALICE', ISSUER_DROPDOWN_INDEX)
          await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
          await assertTextInAccountSelect('ALICE', FREEZER_DROPDOWN_INDEX)

          await assertInfobox('The Admin, Issuer and Freezer accounts are low on funds. They may not be able to perform their tasks until topped up.')
        })
      })

      describe('triggers for 0.3 Unit threshold', () => {
        let defaultAvailableBalance: BN

        beforeAll(() => {
          defaultAvailableBalance = mockUseBalances.availableBalance
        })

        it('is displayed for an account with less funds than threshold', async () => {
          mockUseBalances.availableBalance = new BN(0.28 * Math.pow(10, mockUseChainToken.chainDecimals))

          renderModal()
          await enterSecondStep()

          await assertText('Owner account')

          await assertInfobox('The Admin, Issuer and Freezer accounts are low on funds. They may not be able to perform their tasks until topped up.')
        })

        it('is hidden for an account with more funds than threshold', async () => {
          mockUseBalances.availableBalance = new BN(0.31 * Math.pow(10, mockUseChainToken.chainDecimals))

          renderModal()
          await enterSecondStep()

          await assertText('Owner account')

          assertNoInfobox()
        })

        afterAll(() => {
          mockUseBalances.availableBalance = defaultAvailableBalance
        })
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
        await findAndClickButton('Confirm')

        expect(mockUseApi.api.tx.assets.setTeam).toBeCalledWith(ASSET_ID, aliceAccount.address, bobAccount.address, bobAccount.address)
      })

      it('freezer', async () => {
        await selectAccountFromDropdown(FREEZER_DROPDOWN_INDEX, ALICE_ACCOUNT_INDEX)
        clickButton('Next')
        await findAndClickButton('Confirm')

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
    beforeEach(() => {
      setTeleportTransactionStatus(TransactionStatus.Ready)
      setCreateAssetTransactionStatus(TransactionStatus.Ready)
    })

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
            'Chainstatemine',
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

          await findAndClickButton('Confirm')

          assertButtonDisabled('Confirm')
          assertButtonDisabled('Back')

          await assertTransactionInfoBlock(1, 'sign', [
            'Chainstatemine',
            'Statemine fee0.0300KSM'
          ])
        })

        it('does not show teleport transaction info for ongoing create asset transaction with no more funds available on the owner account', async () => {
          renderModal()
          await enterThirdStep()

          setCreateAssetTransactionStatus(TransactionStatus.AwaitingSign)
          mockUseBalances.availableBalance = new BN(0)

          assertStepsBarVisible()
          assertContentVisible()

          await findAndClickButton('Confirm')

          await assertTransactionInfoBlock(1, 'sign', [
            'Chainstatemine',
            'Statemine fee0.0300KSM'
          ])
        })

        afterAll(() => {
          mockUseBalances.availableBalance = new BN(4000000000000000)
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
          expect(modalContent).toHaveTextContent('Asset CreationAsset creation transaction is included in a block. Waiting until it is confirmed.')
        })

        it('Success', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.Success)

          renderModal()
          await enterThirdStep()

          assertStepsBarHidden()
          assertContentHidden()

          const modalContent = screen.getByTestId('status-step-Success')
          expect(modalContent).toHaveTextContent('Congratulations!')
          expect(modalContent).toHaveTextContent('Your asset has been created.')
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
      describe('displays', () => {
        it('info about teleport execution', async () => {
          mockActiveAccount = (chain: Chains | undefined) => {
            switch (chain) {
              case Chains.Kusama:
                return { activeAccount: bobActiveAccount, setActiveAccount: () => { /**/ }, isLoaded: true }
              default:
                return { activeAccount: aliceActiveAccount, setActiveAccount: () => { /**/ }, isLoaded: true }
            }
          }

          renderModal()
          await enterThirdStep()

          await assertInfobox('Owner account has insufficient funds on Statemine to create the asset. A Teleport transaction from selected Kusama account will be executed.')
        })

        it('warning about missing kusama account with a button', async () => {
          mockActiveAccount = (chain: Chains | undefined) => {
            switch (chain) {
              case Chains.Kusama:
                return { activeAccount: undefined, setActiveAccount: () => { /**/ }, isLoaded: true }
              default:
                return { activeAccount: aliceActiveAccount, setActiveAccount: () => { /**/ }, isLoaded: true }
            }
          }

          renderModal()
          await enterThirdStep()

          await assertInfobox('Insufficient funds on the owner account to create the asset. Cannot execute teleport transaction due to not selected Kusama account.Select Kusama account', 'warning')
          await findAndClickButton('Select Kusama account')

          expect(openAccountSelectModal).toBeCalledTimes(1)
        })

        it('hides info after teleport transaction', async () => {
          mockUseBalances.availableBalance = EXPECTED_TELEPORT_AMOUNT.addn(1)
          setTeleportTransactionStatus(TransactionStatus.Success)

          renderModal()
          await enterThirdStep()

          await assertNoInfobox()
          await assertNoInfobox('warning')
        })

        it('infobox if relay chain account has less funds than teleport amount', async () => {
          mockActiveAccount = () => ({ activeAccount: aliceActiveAccount, setActiveAccount: () => { /**/ }, isLoaded: true })

          renderModal()
          await enterThirdStep()

          await assertInfobox(
            'Selected Kusama account has insufficient funds to execute teleport transaction.Change Kusama account',
            'warning'
          )

          assertButtonDisabled('Confirm')
        })
      })

      describe('displays transaction info', () => {
        it('when statemine account has zero funds', async () => {
          setTeleportTransactionStatus(TransactionStatus.Ready)
          mockUseBalances.availableBalance = new BN(0)
          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'Chainkusamastatemine',
            'Teleport amount140.0310KSM',
            'Kusama fee0.0300KSM'
          ])

          await assertTransactionInfoBlock(2, 'ready', [
            'Chainstatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })

        it('when statemine account has less funds than needed', async () => {
          mockUseBalances.availableBalance = mockUseBalancesConstants.existentialDeposit
          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'Chainkusamastatemine',
            'Teleport amount140.0310KSM',
            'Kusama fee0.0300KSM'
          ])

          await assertTransactionInfoBlock(2, 'ready', [
            'Chainstatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })

        it('after successful teleport', async () => {
          mockUseBalances.availableBalance = EXPECTED_TELEPORT_AMOUNT.addn(1)
          setTeleportTransactionStatus(TransactionStatus.Success)

          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'done', [])

          await assertTransactionInfoBlock(2, 'ready', [
            'Chainstatemine',
            'Deposit140.0000KSM',
            'Statemine fee0.0300KSM'
          ])
        })

        it('when still loading teleport fee', async () => {
          const paymentInfo = mockUseTeleport.paymentInfo
          mockUseTeleport = { ...mockUseTeleport, paymentInfo: undefined }

          setTeleportTransactionStatus(TransactionStatus.Ready)
          mockUseBalances.availableBalance = new BN(0)

          renderModal()
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'Chainkusamastatemine',
            'Teleport amount140.0310KSM',
            'Kusama fee-'
          ])

          mockUseTeleport = { ...mockUseTeleport, paymentInfo }
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
          expect(modalContent).toHaveTextContent('Teleport transaction is included in a block. Waiting until it is confirmed.')
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

      it('after teleport executes asset transaction with updated content', async () => {
        setTeleportTransactionStatus(TransactionStatus.Success)
        setCreateAssetTransactionStatus(TransactionStatus.InBlock)

        renderModal()
        await enterThirdStep()

        assertStepsBarHidden()
        assertContentHidden()

        const modalContent = screen.getByTestId('status-step-InBlock')
        expect(modalContent).toHaveTextContent('Pending transaction 2/2...')
        expect(modalContent).toHaveTextContent('Transaction #2')
        expect(modalContent).toHaveTextContent('Asset Creation')
        expect(modalContent).toHaveTextContent('Asset creation transaction is included in a block. Waiting until it is confirmed.')
      })
    })

    describe('displays summary', () => {
      it('for create asset transaction', async () => {
        mockActiveAccount = () => ({ activeAccount: bobActiveAccount, setActiveAccount: () => { /**/ }, isLoaded: true })

        mockUseBalances.availableBalance = EXPECTED_TELEPORT_AMOUNT.addn(1)

        renderModal()
        await enterThirdStep()

        const summary = screen.getByTestId('transaction-cost-summary')
        expect(summary).toHaveTextContent('Total amount:140.0610KSM')
        expect(summary).toHaveTextContent('Transaction fee:0.0300KSM')
      })

      it('for teleport and create asset transactions', async () => {
        mockUseBalances.availableBalance = new BN(0)

        renderModal()
        await enterThirdStep()

        const summary = screen.getByTestId('transaction-cost-summary')
        expect(summary).toHaveTextContent('Total amount:140.0910KSM')
        expect(summary).toHaveTextContent('Transaction fee:0.0600KSM')
      })
    })

    it('after asset creation opens asset\'s statescan page in new tab', async () => {
      setCreateAssetTransactionStatus(TransactionStatus.Success)

      renderModal()
      await enterThirdStep()

      assertStepsBarHidden()
      assertContentHidden()

      await findAndClickButton('View asset in explorer')
      assertNewTabOpened('https://statemine.statescan.io/asset/' + ASSET_ID)
    })

    describe('on api change', () => {
      describe('updates displayed chain names to', () => {
        beforeEach(() => {
          setTeleportTransactionStatus(TransactionStatus.Ready)
          mockUseBalances.availableBalance = new BN(0)
          renderModal()
        })

        it('polkadot', async () => {
          await switchApiTo(Chains.Polkadot)
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'Chainpolkadotstatemint',
            'Teleport amount140.0310KSM',
            'Polkadot fee0.0300KSM'
          ])

          await assertTransactionInfoBlock(2, 'ready', [
            'Chainstatemint',
            'Deposit140.0000KSM',
            'Statemint fee0.0300KSM'
          ])
        })

        it('westend', async () => {
          await switchApiTo(Chains.Westend)
          await enterThirdStep()

          await assertTransactionInfoBlock(1, 'ready', [
            'Chainwestendwestmint',
            'Teleport amount140.0310KSM',
            'Westend fee0.0300KSM'
          ])

          await assertTransactionInfoBlock(2, 'ready', [
            'Chainwestmint',
            'Deposit140.0000KSM',
            'Westmint fee0.0300KSM'
          ])
        })
      })

      describe('updates statescan link for', () => {
        it('polkadot network', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.Success)

          renderModal()
          await switchApiTo(Chains.Polkadot)

          await enterThirdStep()

          await findAndClickButton('View asset in explorer')
          assertNewTabOpened('https://statemint.statescan.io/asset/' + ASSET_ID)
        })

        it('westend network', async () => {
          setCreateAssetTransactionStatus(TransactionStatus.Success)

          renderModal()
          await switchApiTo(Chains.Westend)

          await enterThirdStep()

          await findAndClickButton('View asset in explorer')
          assertNewTabOpened('https://westmint.statescan.io/asset/' + ASSET_ID)
        })
      })
    })
  })
})

const renderModal = (): RenderResult => {
  return renderWithTheme(<AppChainsProvider><TestComponent/></AppChainsProvider>)
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
  const { integers, decimals } = formatBalance(new BN(MIN_BALANCE), +ASSET_DECIMALS) || {}

  const assetModal = await screen.findByTestId('modal')
  expect(assetModal).toHaveTextContent(`Asset name${ASSET_NAME}`)
  expect(assetModal).toHaveTextContent(`Asset symbol${ASSET_SYMBOL}`)
  expect(assetModal).toHaveTextContent(`Asset decimals${ASSET_DECIMALS}`)
  expect(assetModal).toHaveTextContent(`Asset minimal balance${integers}.${decimals}${ASSET_SYMBOL}`)
  expect(assetModal).toHaveTextContent(`Asset id${ASSET_ID}`)
}

const createAsset = async (): Promise<void> => {
  await openModal()

  fillFirstStep()
  clickButton('Next')
  await fillSecondStep()

  clickButton('Next')
  await findAndClickButton('Confirm')
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
  fillFirstStep()
  clickButton('Next')
}

const closeModal = async () => {
  const closeButton = await screen.findByTestId('modal-close-button')

  fireEvent.click(closeButton)
}

const openModal = async (): Promise<void> => {
  await findAndClickButton('Create new asset')
  await assertText('Create asset')
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

const assertTooltipText = async (text: string) => {
  const tooltip = await screen.findByRole('tooltip')
  within(tooltip).getByText(text)
}

async function hoverInputTooltip(inputName: string) {
  const label = await screen.findByText(inputName)

  userEvent.hover(label.nextSibling as Element)
}
