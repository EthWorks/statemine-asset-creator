import { AccountsContextProvider, ALICE, useAccounts } from '../src'
import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'

describe('useAccountsHook', () => {
  beforeAll(() => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    ((window as any).injectedWeb3) = { 'polkadot-js': null }
  })

  beforeEach(() => {
    jest.useFakeTimers()
    jest.resetModules()
  })

  const mockExtensionDapp = {
    web3Enable: async () => ({}),
    web3AccountsSubscribe: async () => ({}),
    web3Accounts: async () => []
  }

  it('returns for no accounts in keyring', async () => {
    jest.doMock('@polkadot/extension-dapp', () => (mockExtensionDapp))
    const { result, waitForNextUpdate } = renderAccounts()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await waitForNextUpdate()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    const { allAccounts, hasAccounts, error } = result.current

    expect(allAccounts).toHaveLength(0)
    expect(hasAccounts).toBeFalsy()
    expect(error).toBeUndefined()
  })

  it('returns for accounts in keyring', async () => {
    jest.doMock('@polkadot/extension-dapp', () => ({
      ...mockExtensionDapp,
      web3Accounts: async () => [{ address: ALICE, meta: { source: '', name: 'ALICE' } }]
    }))

    const { result, waitForNextUpdate } = renderAccounts()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await waitForNextUpdate()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    const { allAccounts, hasAccounts, error } = result.current

    expect(allAccounts).toHaveLength(1)
    expect(hasAccounts).toBeTruthy()
    expect(error).toBeUndefined()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  afterAll(() => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    ((window as any).injectedWeb3) = undefined
  })

  // we might need a test for an error

  const renderAccounts = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AccountsContextProvider>
        {children}
      </AccountsContextProvider>
    )

    return renderHook(() => useAccounts(), { wrapper })
  }
})
