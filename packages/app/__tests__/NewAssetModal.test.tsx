import { screen, waitFor } from '@testing-library/react'
import React from 'react'

import { NewAssetModal } from '../components'
import { useToggle } from '../utils'
import {
  assertInputError,
  assertText,
  assertTextInput,
  clickButton,
  fillInput,
  findAndClickButton,
  renderWithTheme,
  setLocalStorage
} from './helpers'
import { bobAccount, mockChains } from './mocks'

const KusamaStringLimit = 50

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
const mockApi = {
  api: {
    tx: {
      assets: {
        create: () => {/**/},
        setMetadata: () => {/**/},
      },
      utility: {}
    }
  }
}

jest.mock('use-substrate', () => ({
  useApi: () => mockApi,
  useTransaction: () => mockUseTransaction,
  Chains: () => mockChains
}))

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

  describe('validates asset name length', () => {
    it('does not allow to exceed StringLimit', async () => {
      renderModal()
      clickButton('Create new asset')
      fillFirstStep()
      fillInput('Asset name', 'a'.repeat(KusamaStringLimit + 1))

      await assertInputError('Asset name', `Maximum length of ${KusamaStringLimit} characters exceeded`)
    })
  })
})
