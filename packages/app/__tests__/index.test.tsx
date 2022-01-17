import type { ActiveAccount, UseAssets } from 'use-substrate'

import { act, screen, within } from '@testing-library/react'
import React from 'react'

import { Chains, Chains as mockChains } from 'use-substrate'

import Home from '../pages/index'
import { AppChainsProvider } from '../utils'
import { assertText, clickButton, renderWithTheme, setLocalStorage, switchApiToPolkadot } from './helpers'
import {
  bobAccountId,
  bobAddressForActiveAccountBar,
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseActiveAccounts,
  mockUseApi,
  mockUseAssets,
  mockUseAssetsConstants,
  mockUseBalances,
  mockUseBestNumber,
  mockUseChainToken,
  mockWeb3Enable,
  shortenedAliceAddress,
  shortenedBobAddress,
  shortenedCharlieAddress
} from './mocks'

let mockAssets: UseAssets = []
let mockActiveAccount: ActiveAccount | undefined = { address: bobAccountId }
jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockAssets,
  useAssetsConstants: () => mockUseAssetsConstants,
  useBestNumber: () => mockUseBestNumber,
  useBalances: () => mockUseBalances,
  useChainToken: () => mockUseChainToken,
  useActiveAccounts: () => ({
    ...mockUseActiveAccounts,
    activeAccounts: { [mockChains.Kusama]: mockActiveAccount, [mockChains.Statemine]: mockActiveAccount }
  }),
  useActiveAccount: () => ({
    ...mockUseActiveAccount,
    activeAccount: mockActiveAccount
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

    const activeAccountContainer = await screen.findByTestId('active-account-bar')
    expect(activeAccountContainer).toHaveTextContent(bobAddressForActiveAccountBar)
    expect(activeAccountContainer).toHaveTextContent('kusama,6,000.0000KSM')
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
    beforeEach(() => {
      mockAssets = mockUseAssets
    })

    afterEach(() => {
      mockAssets = []
    })

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

        expect(firstAssetCard).toHaveTextContent('id:9')
        expect(secondAssetCard).toHaveTextContent('id:11')
        expect(firstAssetCard).toHaveTextContent('total supply:1,000.0000TT')
        expect(secondAssetCard).toHaveTextContent('total supply:876.6000toke')

        expect(firstAssetCard).toHaveTextContent('decimals:18')
        expect(secondAssetCard).toHaveTextContent('decimals:12')
      })

      it('displays user roles', async () => {
        renderWithTheme(<Home/>)

        const assetCards = await screen.findByTestId('created-assets')
        const firstAssetCard = within(assetCards).getByTestId('asset-card-9')
        const secondAssetCard = within(assetCards).getByTestId('asset-card-11')

        const firstAssetAdmin = within(firstAssetCard).getByTestId('role-admin')
        within(firstAssetAdmin).getByText('admin')
        within(firstAssetAdmin).getByText(shortenedBobAddress)
        const firstAssetIssuer = within(firstAssetCard).getByTestId('role-issuer')
        within(firstAssetIssuer).getByText('issuer')
        within(firstAssetIssuer).getByText(shortenedAliceAddress)
        const firstAssetFreezer = within(firstAssetCard).getByTestId('role-freezer')
        within(firstAssetFreezer).getByText('freezer')
        within(firstAssetFreezer).getByText(shortenedCharlieAddress)

        const secondAssetAdmin = within(secondAssetCard).getByTestId('role-admin-issuer-freezer')
        within(secondAssetAdmin).getByText('admin, issuer, freezer')
        within(secondAssetAdmin).getByText(shortenedBobAddress)
      })

      it('opens asset\'s statescan page', async () => {
        renderWithTheme(<Home/>)

        const assetCard = await screen.findByTestId('asset-card-9')

        const statescanLink = await within(assetCard).findByText('View in explorer')
        expect(statescanLink).toHaveAttribute('href', 'https://statemine.statescan.io/asset/9')
        expect(statescanLink).toHaveAttribute('target', '_blank')
      })
    })
  })

  describe('page header', () => {
    it('displays Connect button when no active account', async () => {
      mockActiveAccount = undefined
      renderWithTheme(<Home/>)
      const header = await screen.findByTestId('page-header')

      await within(header).findByRole('button', { name: 'Connect' })
      mockActiveAccount = { address: bobAccountId }
    })

    it('displays Active Account Bar when account selected', async () => {
      renderWithTheme(<Home/>)
      const header = await screen.findByTestId('page-header')

      await within(header).findByTestId('active-account-bar')
    })
  })

  it('updates displayed chain icons on active api change', async () => {
    renderWithTheme(<AppChainsProvider><Home/></AppChainsProvider>)

    await assertIcon(Chains.Kusama)
    await assertIcon(Chains.Statemine)

    await switchApiToPolkadot()

    await assertIcon(Chains.Polkadot)
    await assertIcon(Chains.Statemint)
  })
})

async function assertIcon(chain: Chains) {
  await screen.findByTestId(`${chain}-chain-logo`)
}
