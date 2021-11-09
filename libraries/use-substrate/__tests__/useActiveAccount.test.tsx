import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode, useContext } from 'react'

import { ApiContext, BOB, BOB_ID } from '../src'
import { ActiveAccountContext, ActiveAccountProvider, UseActiveAccount } from '../src/providers/activeAccount'
import { mockedKusamaApi } from './mocks/MockedApiProvider'

function useActiveAccount(): UseActiveAccount {
  return useContext(ActiveAccountContext)
}

describe('useActiveAccount', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('can set and get activeAccount via hook', async () => {
    const { result, rerender } = renderActiveAccount()

    const { setActiveAccount } = result.current
    act(() => setActiveAccount(BOB_ID))

    rerender()
    const {  activeAccount } = result.current

    expect(activeAccount).toEqual(BOB_ID)
  })

  it('sets activeAccount in localStorage', async () => {
    const { result } = renderActiveAccount()

    const { setActiveAccount } = result.current
    act(() => setActiveAccount(BOB_ID))

    expect(localStorage.getItem('activeAccount')).toEqual(BOB)
  })

  describe('on load reads localStorage and sets state to', () => {
    it('undefined when activeAccount in not set in localStorage', async () => {
      const { result } = renderActiveAccount()
      const { activeAccount } = result.current

      expect(activeAccount).toBeUndefined()
    })

    it('activeAccount set in localStorage', async () => {
      act(() => localStorage.setItem('activeAccount', BOB))
      const { result } = renderActiveAccount()
      const { activeAccount } = result.current

      expect(activeAccount).toEqual(BOB_ID)
    })
  })

  const renderActiveAccount = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ApiContext.Provider value={{ 'kusama':  mockedKusamaApi }}>
        <ActiveAccountProvider>
          {children}
        </ActiveAccountProvider>
      </ApiContext.Provider>
    )

    return renderHook(() => useActiveAccount(), { wrapper })
  }
})
