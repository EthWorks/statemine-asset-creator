import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode, useContext } from 'react'

import { BOB_ID } from '../src'
import { ActiveAccountContext, ActiveAccountProvider, UseActiveAccount } from '../src/providers/activeAccount'

function useActiveAccount(): UseActiveAccount {
  return useContext(ActiveAccountContext)
}

describe('useActiveAccount', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('can set and get activeAccount via hook', async () => {
    const { result } = renderActiveAccount()

    const { setActiveAccount, activeAccount } = result.current
    setActiveAccount(BOB_ID)

    expect(activeAccount).toEqual(BOB_ID)
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
