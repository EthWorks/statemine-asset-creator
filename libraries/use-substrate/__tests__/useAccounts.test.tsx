import { keyring } from '@polkadot/ui-keyring'
import { ALICE } from '../src'
import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { AccountsContextProvider } from '../src/providers/accounts/provider'
import { useAccounts } from '../src/hooks/useAccounts'

describe('useAccountsHook', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    keyring.loadAll({})
  })

  it('returns accounts from keyring', async () => {
    const { result } = renderAccounts()
    act(() => {
      jest.runOnlyPendingTimers()
    })
    const { allAccounts, hasAccounts, error } = result.current

    expect(allAccounts).toHaveLength(0)
    expect(hasAccounts).toBeFalsy()
    expect(error).toBeUndefined()
  })

  it('returns accounts from keyring', async () => {
    keyring.addExternal(ALICE, { name: 'Alice' })

    const { result } = renderAccounts()
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
