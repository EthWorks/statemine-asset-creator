import type { InjectedWindowProvider } from '@polkadot/extension-inject/types'

import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { AccountsContextProvider, useAccounts } from '../src'
import { ALICE } from './consts/addresses'

describe('useAccountsHook', () => {
  beforeAll(() => {
    window.injectedWeb3 = { 'polkadot-js': null as unknown as InjectedWindowProvider }
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

    await waitForNextUpdate()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await result.current.web3Enable()

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

    await waitForNextUpdate()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await result.current.web3Enable()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    const { allAccounts, hasAccounts, error } = result.current

    expect(allAccounts).toHaveLength(1)
    expect(hasAccounts).toBeTruthy()
    expect(error).toBeUndefined()
  })

  describe('extension status', () => {
    it('initial state', async () => {
      const { result, waitForNextUpdate } = renderAccounts()

      expect(result.current.extensionStatus).toEqual('Loading')

      await waitForNextUpdate()
    })

    it('extension present', async () => {
      const { result, waitForNextUpdate } = renderAccounts()

      await waitForNextUpdate()
      act(() => {
        jest.runOnlyPendingTimers()
      })

      expect(result.current.extensionStatus).toEqual('Available')
    })

    it('extension not present', async () => {
      window.injectedWeb3 = undefined
      const { result, waitForNextUpdate } = renderAccounts()
      await waitForNextUpdate()
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(result.current.extensionStatus).toEqual('Unavailable')
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  afterAll(() => {
    window.injectedWeb3 = undefined
  })

  const renderAccounts = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AccountsContextProvider appName='Statemine asset creator'>
        {children}
      </AccountsContextProvider>
    )

    return renderHook(() => useAccounts(), { wrapper })
  }
})
