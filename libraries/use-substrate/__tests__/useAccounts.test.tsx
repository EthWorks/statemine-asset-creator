import { keyring } from '@polkadot/ui-keyring'
import { ALICE, ApiContext } from '../src'

import React, { ReactNode } from 'react'
import { ApiRx } from '@polkadot/api'
import { renderHook } from '@testing-library/react-hooks'
import { useAccounts } from '../src/hooks/useAccounts'
import { AccountsContextProvider } from '../src/providers/accounts/provider'

describe('useAccountsHook', () => {

  const renderAccounts = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AccountsContextProvider>
        {children}
      </AccountsContextProvider>
    )
    return renderHook(() => useAccounts(), { wrapper })
  }

  beforeEach(() => {
    keyring.addExternal(ALICE, { mame: 'Alice' })
  })

  it('returns accounts from keyring', () => {
    const accounts = renderAccounts()
    expect(accounts).toHaveLength(1)
  })
})
