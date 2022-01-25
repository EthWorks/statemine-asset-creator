import { screen, within } from '@testing-library/react'
import React from 'react'

import { Asset } from 'use-substrate'
import { createType } from 'test-helpers'

import { AssetCard } from '../components'
import { renderWithTheme } from './helpers'
import { mockUseAssets } from './mocks'

describe('AssetCard component', () => {
  it('renders a coin in a color depending on the id', async () => {
    const assets = [
      createAsset(1),
      createAsset(2),
      createAsset(3),
      createAsset(4),
      createAsset(5),
      createAsset(6),
      createAsset(7),
      createAsset(8)
    ]

    renderWithTheme(<>{assets.map(asset => <AssetCard key={asset.id.toString()} asset={asset}/>)}</>)

    await assertCoinColor(1, '#2DD4BF')
    await assertCoinColor(2, '#3B82F6')
    await assertCoinColor(3, '#E4C000')
    await assertCoinColor(4, '#E6007A')

    await assertCoinColor(5, '#2DD4BF')
    await assertCoinColor(6, '#3B82F6')
    await assertCoinColor(7, '#E4C000')
    await assertCoinColor(8, '#E6007A')
  })
})

function createAsset(id: number): Asset {
  return {
    ...mockUseAssets[0],
    id: createType('AssetId', id)
  }
}

async function assertCoinColor(id: number, color: string) {
  const assetCard = await screen.findByTestId(`asset-card-${id}`)

  const assetImage = within(assetCard).getByTestId('asset-image')
  expect(assetImage).toHaveAttribute('color', color)
}
