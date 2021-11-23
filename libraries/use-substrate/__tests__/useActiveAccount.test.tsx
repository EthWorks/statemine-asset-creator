import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { ActiveAccountProvider, Chains, useActiveAccounts } from '../src'
import { ALICE_ID, BOB, BOB_ID } from './consts/addresses'
import { mockedKusamaApi } from './mocks/MockedApiProvider'

describe('useActiveAccount', () => {
  describe('with localStorage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('can set and get activeAccounts via hook', async () => {
      const { result, rerender } = renderActiveAccount()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts(Chains.Kusama, BOB_ID))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID)
    })

    it('can set and get multiple activeAccounts via hook', async () => {
      const { result, rerender } = renderActiveAccount()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts(Chains.Kusama, BOB_ID))

      rerender()
      const { setActiveAccounts: setAfterRerender } = result.current
      act(() => setAfterRerender(Chains.Statemine, ALICE_ID))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID)
      expect(activeAccounts && activeAccounts[Chains.Statemine]).toEqual(ALICE_ID)
    })

    it('can override activeAccounts', async () => {
      const { result, rerender } = renderActiveAccount()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts(Chains.Kusama, BOB_ID))

      rerender()

      const { activeAccounts, setActiveAccounts: setAfterRerender } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID)

      act(() => setAfterRerender(Chains.Kusama, ALICE_ID))

      rerender()

      const { activeAccounts: overriddenAccounts } = result.current
      expect(overriddenAccounts && overriddenAccounts[Chains.Kusama]).toEqual(ALICE_ID)
    })

    it('sets activeAccounts (as accountId) in localStorage', async () => {
      const { result } = renderActiveAccount()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts(Chains.Kusama, BOB_ID))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB)
    })

    it('sets activeAccounts (as string) in localStorage', async () => {
      const { result } = renderActiveAccount()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts(Chains.Kusama, BOB))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB)
    })

    describe('on load reads localStorage and sets state to', () => {
      it('undefined when activeAccounts are not set in localStorage', async () => {
        const { result } = renderActiveAccount()
        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts && activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toBeUndefined()
      })

      it('activeAccounts set in localStorage', async () => {
        act(() => localStorage.setItem('activeAccounts', JSON.stringify({ kusama: BOB })))
        const { result } = renderActiveAccount()
        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts && activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toEqual(BOB_ID)
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
    
    it('can set and get activeAccounts', async () => {
      const { result, rerender } = renderActiveAccount()

      const { setActiveAccounts, activeAccounts: initActiveAccounts } = result.current
      expect(initActiveAccounts).toEqual({})

      act(() => setActiveAccounts(Chains.Kusama, BOB_ID))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID)
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

    return renderHook(() => useActiveAccounts(), { wrapper })
  }
})
