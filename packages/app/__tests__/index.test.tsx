import { act, screen, within } from '@testing-library/react'
import React from 'react'

import Home from '../pages/index'
import { mockUseBestNumber } from './mocks/mockUseBestNumber'
import { assertText, clickButton, renderWithTheme, setLocalStorage } from './helpers'
import {
  aliceAccount,
  bobAccount,
  bobAccountId,
  charlieAccount,
  mockChains,
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseApi,
  mockUseAssets,
  mockUseAssetsConstants,
  mockUseBalances,
  mockWeb3Enable
} from './mocks'

let mockActiveAccount = bobAccountId
jest.mock('use-substrate', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useBestNumber: () => mockUseBestNumber,
  useBalances: () => mockUseBalances,
  Chains: () => mockChains,
  useActiveAccount: () => ({
    ...mockUseActiveAccount,
    activeAccount: mockActiveAccount,
  })
}))

describe('Home', () => {
  beforeEach(() => {
    act(() => {
      mockWeb3Enable.mockClear()
      localStorage.clear()
      setLocalStorage('extensionActivated', 'true')
    })
  })

  it('displays kusama balance of selected account', async () => {
    renderWithTheme(<Home/>)

    const activeAccountContainer = screen.getByTestId('active-account-bar')
    expect(activeAccountContainer).toHaveTextContent(bobAccount.address)

    await assertText('KUSAMA 6000000000000000 KSM')
  })

  it('opens create asset modal', async () => {
    renderWithTheme(<Home/>)
    clickButton('Create new asset')

    await assertText('Create asset')

    await screen.findByLabelText('Asset name')
    await screen.findByLabelText('Asset symbol')
    await screen.findByLabelText('Asset decimals')
    await screen.findByLabelText('Asset ID')
  })

  describe('created asset list', () => {
    it('shows created assets amount', async () => {
      renderWithTheme(<Home/>)

      await assertText('Dashboard')
      await assertText('Created assets [2]')
    })

    describe('asset cards', () => {
      it('displays main asset infos', async () => {
        renderWithTheme(<Home/>)

        const assetCards = await screen.findByTestId('created-assets')
        const firstAssetCard = within(assetCards).getByTestId('asset-card-9')
        const secondAssetCard = within(assetCards).getByTestId('asset-card-11')

        within(firstAssetCard).getByText('Bob\'s Asset')
        within(secondAssetCard).getByText('Bob\'s Asset 2')

        within(firstAssetCard).getByText('id: 9')
        within(secondAssetCard).getByText('id: 11')

        within(firstAssetCard).getByText('total supply: 100000 KSM')
        within(secondAssetCard).getByText('total supply: 8766 KSM')

        within(firstAssetCard).getByText('decimals: 18')
        within(secondAssetCard).getByText('decimals: 12')
      })

      it('displays user roles', async () => {
        renderWithTheme(<Home/>)

        const assetCards = await screen.findByTestId('created-assets')
        const firstAssetCard = within(assetCards).getByTestId('asset-card-9')
        const secondAssetCard = within(assetCards).getByTestId('asset-card-11')

        const firstAssetAdmin = within(firstAssetCard).getByTestId('role-admin')
        within(firstAssetAdmin).getByText('admin')
        within(firstAssetAdmin).getByText(bobAccount.address)
        const firstAssetIssuer = within(firstAssetCard).getByTestId('role-issuer')
        within(firstAssetIssuer).getByText('issuer')
        within(firstAssetIssuer).getByText(aliceAccount.address)
        const firstAssetFreezer = within(firstAssetCard).getByTestId('role-freezer')
        within(firstAssetFreezer).getByText('freezer')
        within(firstAssetFreezer).getByText(charlieAccount.address)

        const secondAssetAdmin = within(secondAssetCard).getByTestId('role-admin-issuer-freezer')
        within(secondAssetAdmin).getByText('admin, issuer, freezer')
        within(secondAssetAdmin).getByText(bobAccount.address)
      })
    })
  })

  describe('page header', () => {
    it('displays Connect button when no active account', async () => {
      mockActiveAccount = undefined
      renderWithTheme(<Home/>)
      const header = await screen.findByTestId('page-header')

      await within(header).findByRole('button', { name: 'Connect' })
    })

    it('displays Active Account Bar when account selected', async () => {
      renderWithTheme(<Home/>)
      const header = await screen.findByTestId('page-header')

      await within(header).findByTestId('active-account-bar')
    })

    afterEach(() => {
      mockActiveAccount = bobAccountId
    })
  })
})
