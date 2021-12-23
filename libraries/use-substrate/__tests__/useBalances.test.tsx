import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useBalances } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'
import { ALICE } from './consts'

describe('useBalances hook', () => {
  it('returns balances', async () => {
    const { result } = renderResult(ALICE, Chains.Kusama)
    const { freeBalance, accountNonce, accountId } = result.current || {}

    expect(freeBalance?.toString()).toEqual('10000')
    expect(accountNonce?.toString()).toEqual('3')
    expect(accountId?.toString()).toEqual(ALICE)
  })

  it('when using not configured chain it throws', () => {
    const { result } = renderResult(ALICE, Chains.Karura)
    expect(result.error?.message).toEqual('karura is not configured')
  })

  it('return undefined for null address', async () => {
    const { result } = renderResult(undefined, Chains.Kusama)
    expect(result.current).toEqual(undefined)
  })

  it('returns token and decimals', async () => {
    const { result } = renderResult(ALICE, Chains.Kusama)
    const { chainTokens, chainDecimals } = result.current || {}

    expect(chainDecimals?.[0]).toEqual(18)
    expect(chainTokens?.[0]).toEqual('TT')
  })

  const renderResult = (address: string | undefined, chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useBalances(address, chain), { wrapper })
  }
})
