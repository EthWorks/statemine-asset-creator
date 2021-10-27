import { render } from '@testing-library/react'

import { assertText, clickButton, fillInput } from '../../__tests__/helpers'
import { NewAssetModalProvider } from './context/provider'
import NewAssetModal from './index'

const renderModal = (): void => {
  render(<NewAssetModalProvider><NewAssetModal/></NewAssetModalProvider>)
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

    fillFirstStep()
    clickButton('Next')

    await assertText('Confirm')
    await assertText('kusama')
    await assertText('KSM')
    await assertText('18')
    await assertText('7')
  })
})
