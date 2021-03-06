import type { InjectedWindowProvider } from '@polkadot/extension-inject/types'

import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { AccountsContextProvider, useAccounts } from '../src'
import { mockExtensionDapp } from './mocks/mockExtensionDapp'
import { ALICE, BOB, BOB_ACTIVE_ACCOUNT_KUSAMA_FORMAT } from './consts'

describe('useAccountsHook', () => {
  beforeAll(() => {
    window.injectedWeb3 = { 'polkadot-js': null as unknown as InjectedWindowProvider }
  })

  beforeEach(() => {
    jest.useFakeTimers()
    jest.resetModules()
  })

  it('returns for no accounts in keyring', async () => {
    jest.doMock('@polkadot/extension-dapp', () => mockExtensionDapp)
    const { result, waitForNextUpdate } = renderAccounts()

    await waitForNextUpdate()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await act(async () => {
      await result.current.web3Enable()
    })

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

    await act(async () => {
      await result.current.web3Enable()
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    const { allAccounts, hasAccounts, error } = result.current

    expect(allAccounts).toHaveLength(1)
    expect(hasAccounts).toBeTruthy()
    expect(error).toBeUndefined()
  })

  it('returns for accounts in keyring in different ss58Format', async () => {
    jest.doMock('@polkadot/extension-dapp', () => ({
      ...mockExtensionDapp,
      web3Accounts: async () => [{ address: BOB, meta: { source: '', name: 'BOB' } }]
    }))

    const { result, waitForNextUpdate } = renderAccounts(2)

    await waitForNextUpdate()

    act(() => {
      jest.runOnlyPendingTimers()
    })

    await act(async () => {
      await result.current.web3Enable()
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    const { allAccounts } = result.current

    expect(allAccounts).toHaveLength(1)
    expect(allAccounts[0]).toEqual({ address: BOB_ACTIVE_ACCOUNT_KUSAMA_FORMAT.address.toString(), name: 'BOB' })
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

  const renderAccounts = (ss58Format?: number) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AccountsContextProvider appName='Statemine asset creator' ss58Format={ss58Format}>
        {children}
      </AccountsContextProvider>
    )

    return renderHook(() => useAccounts(), { wrapper })
  }
})
