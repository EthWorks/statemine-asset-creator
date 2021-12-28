import React from 'react'

import Home from '../pages'
import { assertText, renderWithTheme } from './helpers'
import {
  mockUseAccounts,
  mockUseActiveAccount,
  mockUseActiveAccounts,
  mockUseApi,
  mockUseAssets,
  mockUseBalances,
  mockUseBestNumber,
  mockUseChainToken
} from './mocks'

jest.mock('use-substrate/dist/src/hooks', () => ({
  useAccounts: () => mockUseAccounts,
  useApi: () => mockUseApi,
  useAssets: () => mockUseAssets,
  useBalances: () => mockUseBalances,
  useBestNumber: () => mockUseBestNumber,
  useActiveAccounts: () => mockUseActiveAccounts,
  useActiveAccount: () => mockUseActiveAccount,
  useChainToken: () => mockUseChainToken
}))

describe('error', () => {
  describe('renders 500 error page for', () => {
    it('disconnected api state', async () => {
      mockUseApi.connectionState = 'disconnected'
      renderWithTheme(<Home/>)

      await assertText('Ooops...Something went wrong')
      await assertText('Try again later')
    })

    it('error api state', async () => {
      mockUseApi.connectionState = 'error'
      renderWithTheme(<Home/>)

      await assertText('Ooops...Something went wrong')
      await assertText('Try again later')
    })
  })
})
