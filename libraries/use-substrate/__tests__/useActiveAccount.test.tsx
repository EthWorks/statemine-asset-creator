import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode, useContext } from 'react'

import { ActiveAccountContext, ActiveAccountProvider, UseActiveAccount } from '../src/providers/activeAccount'

function useActiveAccount(): UseActiveAccount {
  return useContext(ActiveAccountContext)
}

describe('useActiveAccount', () => {
  it('returns for no accounts in keyring', async () => {
    renderActiveAccount()
  })

  const renderActiveAccount = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ActiveAccountProvider>
        {children}
      </ActiveAccountProvider>
    )

    return renderHook(() => useActiveAccount(), { wrapper })
  }
})
