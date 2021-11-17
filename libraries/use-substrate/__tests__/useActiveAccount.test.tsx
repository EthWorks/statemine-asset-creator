import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { ActiveAccountProvider, useActiveAccount } from '../src'
import { BOB, BOB_ID } from './consts/addresses'
import { mockedKusamaApi } from './mocks/MockedApiProvider'

describe('useActiveAccount', () => {
  describe('with localStorage', () => {
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

    it('sets activeAccount (as accountId) in localStorage', async () => {
      const { result } = renderActiveAccount()

      const { setActiveAccount } = result.current
      act(() => setActiveAccount(BOB_ID))

      expect(localStorage.getItem('activeAccount')).toEqual(BOB)
    })

    it('sets activeAccount (as string) in localStorage', async () => {
      const { result } = renderActiveAccount()

      const { setActiveAccount } = result.current
      act(() => setActiveAccount(BOB))

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
  })

  describe('without localStorage ', () => {
    let store: Storage
    
    beforeAll(() => {
      store = window.localStorage
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete window.localStorage
    })
    
    it('can set and get activeAccount', async () => {
      const { result, rerender } = renderActiveAccount()

      const { setActiveAccount, activeAccount: initActiveAccount } = result.current
      expect(initActiveAccount).toBeUndefined()

      act(() => setActiveAccount(BOB_ID))

      rerender()
      const {  activeAccount } = result.current

      expect(activeAccount).toEqual(BOB_ID)
    })
    
    afterAll (() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.localStorage = store
    })
  })
  
  const renderActiveAccount = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ActiveAccountProvider api={mockedKusamaApi.api}>
        {children}
      </ActiveAccountProvider>
    )

    return renderHook(() => useActiveAccount(), { wrapper })
  }
})
