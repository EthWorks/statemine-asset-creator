import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { ActiveAccountProvider, Chains, useActiveAccount, useActiveAccounts } from '../src'
import { mockedKusamaApi } from './mocks/MockedApiProvider'
import { ALICE_ID_WITHOUT_NAME, BOB_ID_WITHOUT_NAME } from './consts'

describe('use active account', () => {
  describe('can set an active account for a specific chain', () => {
    afterEach(() => {
      localStorage.clear()
    })

    it('and get by use active account', () => {
      const { result, rerender } = renderActiveAccount(Chains.Kusama)

      expect(result.current.activeAccount).toEqual(undefined)

      const { setActiveAccount } = result.current
      act(() => setActiveAccount(BOB_ID_WITHOUT_NAME))

      rerender()

      const activeAccount = result.current.activeAccount

      expect(activeAccount).toEqual(BOB_ID_WITHOUT_NAME)
    })

    it('and get by use active accounts', () => {
      const { result, rerender } = renderActiveAccount(Chains.Kusama)

      expect(result.current.activeAccounts[Chains.Kusama]).toEqual(undefined)

      const { setActiveAccount } = result.current
      act(() => setActiveAccount(BOB_ID_WITHOUT_NAME))

      rerender()

      expect(result.current.activeAccounts[Chains.Kusama]).toEqual(BOB_ID_WITHOUT_NAME)
    })
  })

  it('can override an active account', () => {
    const { result, rerender } = renderActiveAccount(Chains.Kusama)

    const { setActiveAccount } = result.current
    act(() => setActiveAccount(BOB_ID_WITHOUT_NAME))

    rerender()

    const { activeAccount, setActiveAccount: setAfterRerender } = result.current

    expect(activeAccount).toEqual(BOB_ID_WITHOUT_NAME)

    act(() => setAfterRerender(ALICE_ID_WITHOUT_NAME))

    rerender()

    const { activeAccount: overriddenAccount } = result.current
    expect(overriddenAccount).toEqual(ALICE_ID_WITHOUT_NAME)
  })

  const renderActiveAccount = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ActiveAccountProvider api={mockedKusamaApi.api}>
        {children}
      </ActiveAccountProvider>
    )

    return renderHook(() => {
      const { activeAccount, setActiveAccount } = useActiveAccount(chain)
      const { activeAccounts } = useActiveAccounts()

      return { activeAccount, setActiveAccount, activeAccounts }
    }, { wrapper })
  }
})
