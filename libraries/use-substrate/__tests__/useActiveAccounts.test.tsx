import { ApiRx } from '@polkadot/api'
import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { kusamaCreateType } from 'test-helpers'

import { ActiveAccountProvider, Chains, useActiveAccounts } from '../src'
import { mockedKusamaApi } from './mocks/MockedApiProvider'
import {
  ALICE_ACTIVE_ACCOUNT_WITHOUT_NAME,
  BOB_ACCOUNT_WITHOUT_NAME,
  BOB_ACTIVE_ACCOUNT,
  BOB_ACTIVE_ACCOUNT_KUSAMA_FORMAT,
  BOB_ACTIVE_ACCOUNT_WITHOUT_NAME
} from './consts'

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
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT_WITHOUT_NAME }))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts[Chains.Kusama]).toEqual(BOB_ACTIVE_ACCOUNT_WITHOUT_NAME)
    })

    it('can set and get multiple active accounts via hook', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT_WITHOUT_NAME, [Chains.Statemine]: ALICE_ACTIVE_ACCOUNT_WITHOUT_NAME }))

      rerender()

      const { activeAccounts } = result.current

      expect(activeAccounts[Chains.Kusama]).toEqual(BOB_ACTIVE_ACCOUNT_WITHOUT_NAME)
      expect(activeAccounts[Chains.Statemine]).toEqual(ALICE_ACTIVE_ACCOUNT_WITHOUT_NAME)
    })

    it('can override an active account', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT_WITHOUT_NAME }))

      rerender()

      const { activeAccounts, setActiveAccounts: setAfterRerender } = result.current

      expect(activeAccounts[Chains.Kusama]).toEqual(BOB_ACTIVE_ACCOUNT_WITHOUT_NAME)

      act(() => setAfterRerender({ [Chains.Kusama]: ALICE_ACTIVE_ACCOUNT_WITHOUT_NAME }))

      rerender()

      const { activeAccounts: overriddenAccounts } = result.current
      expect(overriddenAccounts[Chains.Kusama]).toEqual(ALICE_ACTIVE_ACCOUNT_WITHOUT_NAME)
    })

    it('sets activeAccounts (as accountId) in localStorage', async () => {
      const { result } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT_WITHOUT_NAME }))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB_ACCOUNT_WITHOUT_NAME)
    })

    it('sets activeAccounts (as string) in localStorage', async () => {
      const { result } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACCOUNT_WITHOUT_NAME }))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB_ACCOUNT_WITHOUT_NAME)
    })

    it('sets activeAccounts in substrate format in localStorage', async () => {
      const { result } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT_KUSAMA_FORMAT }))

      const activeAccounts = localStorage.getItem('activeAccounts')

      expect(JSON.parse(activeAccounts || '{}')[Chains.Kusama]).toEqual(BOB_ACCOUNT_WITHOUT_NAME)
    })

    describe('on load reads localStorage and sets state to', () => {
      it('undefined when activeAccounts are not set in localStorage', async () => {
        const { result } = renderActiveAccounts()
        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toBeUndefined()
      })

      it('activeAccounts set in localStorage', async () => {
        act(() => {
          localStorage.setItem('activeAccounts', JSON.stringify({ kusama: BOB_ACCOUNT_WITHOUT_NAME }))
        })

        const { result } = renderActiveAccounts()
        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toEqual(BOB_ACTIVE_ACCOUNT_WITHOUT_NAME)
      })

      it('activeAccounts set in localStorage in chain specific accountId format', async () => {
        act(() => {
          localStorage.setItem('activeAccounts', JSON.stringify({ kusama: BOB_ACCOUNT_WITHOUT_NAME }))
        })

        const { result } = renderActiveAccounts(mockCustomKusamaApi)

        const { activeAccounts } = result.current

        const kusamaActiveAccount = activeAccounts[Chains.Kusama]
        expect(kusamaActiveAccount).toEqual(BOB_ACTIVE_ACCOUNT_KUSAMA_FORMAT)
      })
    })

    it('can set and get active account with name via hook', async () => {
      const { result, rerender } = renderActiveAccounts()

      const { setActiveAccounts } = result.current
      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT }))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts && activeAccounts[Chains.Kusama]).toEqual(BOB_ACTIVE_ACCOUNT)
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

      act(() => setActiveAccounts({ [Chains.Kusama]: BOB_ACTIVE_ACCOUNT_WITHOUT_NAME }))

      rerender()
      const { activeAccounts } = result.current

      expect(activeAccounts[Chains.Kusama]).toEqual(BOB_ACTIVE_ACCOUNT_WITHOUT_NAME)
    })

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.localStorage = store
    })
  })

  const renderActiveAccounts = (customApi?: ApiRx) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ActiveAccountProvider api={customApi ?? mockedKusamaApi.api}>
        {children}
      </ActiveAccountProvider>
    )

    return renderHook(() => useActiveAccounts(), { wrapper })
  }
})

const mockCustomKusamaApi: ApiRx = {
  ...mockedKusamaApi.api,
  createType: kusamaCreateType
} as ApiRx
