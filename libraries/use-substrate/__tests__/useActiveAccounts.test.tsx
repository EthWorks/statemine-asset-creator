import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { ActiveAccountProvider, Chains, useActiveAccounts } from '../src'
import { mockedKusamaApi } from './mocks/MockedApiProvider'
import { ALICE_ID_WITHOUT_NAME, BOB_ID_WITH_NAME, BOB_ID_WITHOUT_NAME, BOB_WITHOUT_NAME } from './consts'

jest.mock('../src/hooks/useAccounts')

describe('use active accounts', () => {
  beforeEach(() => {
    jest.resetModules()
  })
  describe('with localStorage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('can set and get active account via hook', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ID_WITHOUT_NAME }))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID_WITHOUT_NAME)
    })

    it('can set and get multiple active accounts via hook', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ID_WITHOUT_NAME, [Chains.Statemine]: ALICE_ID_WITHOUT_NAME }))

      rerender()

      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID_WITHOUT_NAME)
      expect(activeAccounts && activeAccounts[Chains.Statemine]).toEqual(ALICE_ID_WITHOUT_NAME)
    })

    it('can override an active account', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ID_WITHOUT_NAME }))

      rerender()

      const { activeAccounts, setActiveAccounts: setAfterRerender } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID_WITHOUT_NAME)

      act(() => setAfterRerender({ [Chains.Kusama]: ALICE_ID_WITHOUT_NAME }))

      rerender()

      const { activeAccounts: overriddenAccounts } = result.current
      expect(overriddenAccounts && overriddenAccounts[Chains.Kusama]).toEqual(ALICE_ID_WITHOUT_NAME)
    })

    it('sets activeAccounts (as accountId) in localStorage', async () => {
      const { result } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ID_WITHOUT_NAME }))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB_WITHOUT_NAME)
    })

    it('sets activeAccounts (as string) in localStorage', async () => {
      const { result } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_WITHOUT_NAME }))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB_WITHOUT_NAME)
    })

    describe('on load reads localStorage and sets state to', () => {
      it('undefined when activeAccounts are not set in localStorage', async () => {
        const { result } = renderActiveAccounts()
        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts && activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toBeUndefined()
      })

      it('activeAccounts set in localStorage', async () => {
        act(() => {
          localStorage.setItem('activeAccounts', JSON.stringify({ kusama: BOB_WITHOUT_NAME }))
        })

        const { result } = renderActiveAccounts()
        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts && activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toEqual(BOB_ID_WITHOUT_NAME)
      })
    })

    it('with name can set and get active account via hook', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ID_WITH_NAME }))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID_WITH_NAME)
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
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts, activeAccounts: initActiveAccounts } = result.current
      expect(initActiveAccounts).toEqual({})

      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ID_WITHOUT_NAME }))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ID_WITHOUT_NAME)
    })

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.localStorage = store
    })
  })

  const renderActiveAccounts = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ActiveAccountProvider api={mockedKusamaApi.api}>
        {children}
      </ActiveAccountProvider>
    )

    return renderHook(() => useActiveAccounts(), { wrapper })
  }
})
