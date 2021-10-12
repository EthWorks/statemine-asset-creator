import { AccountsContextProvider, ALICE, useAccounts } from '../src'
import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { mockHooks } from './_mocks/mockHooks'

jest.mock('@polkadot/extension-dapp', () => ({
  web3Enable: async () => ({}),
  web3AccountsSubscribe: async () => ({}),
  web3Accounts: async () => mockHooks.injectedAccounts
}))

describe('useAccountsHook', () => {
  beforeEach(() => {
    ;((window as any).injectedWeb3) = { 'polkadot-js': null }
    jest.useFakeTimers()
  })

  afterEach(async () => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllTimers()
  })

  it('returns for no accounts in keyring', async () => {
    const { result, waitForNextUpdate, unmount } = renderAccounts()

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
    mockHooks.setInjectedAccounts([{ address: ALICE, meta: { source: '', name: 'ALICE' } }])

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
