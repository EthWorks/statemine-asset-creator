import React from 'react'

import { assertText, assertTextInput, clickButton, fillInput, renderComponent } from '../../__tests__/helpers'
import { useToggle } from '../../utils'
import { NewAssetModal } from './index'

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
  renderComponent(<TestComponent/>)
}

const fillFirstStep = (): void => {
  fillInput('Asset name', 'kusama')
  fillInput('Asset symbol', 'KSM')
  fillInput('Asset decimals', '18')
  fillInput('Asset ID', '7')
}

describe('New asset modal', () => {
  it('saves data in context', async () => {
    renderModal()

    clickButton('Create new asset')

    fillFirstStep()
    clickButton('Next')

    await assertText('Confirm')
    await assertText('kusama')
    await assertText('KSM')
    await assertText('18')
    await assertText('7')
  })

  it('closes modal and resets data on confirm', async () => {
    renderModal()
    clickButton('Create new asset')

    fillFirstStep()
    clickButton('Next')

    clickButton('Confirm')

    clickButton('Create new asset')

    assertTextInput('Asset name', '')
    assertTextInput('Asset symbol', '')
    assertTextInput('Asset decimals', '')
    assertTextInput('Asset ID', '')
  })
})
