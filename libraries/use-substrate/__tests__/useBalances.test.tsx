import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { ALICE, Chains, useBalances } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useBalances hook', () => {
  it('returns balances', async () => {
    const { result } = renderResult(Chains.Kusama, ALICE)
    const { freeBalance, accountNonce, accountId } = result.current || {}

    expect(freeBalance?.toString()).toEqual('10000')
    expect(accountNonce?.toString()).toEqual('3')
    expect(accountId?.toString()).toEqual(ALICE)
  })

  it('when using not configured chain it throws', () => {
    const { result } = renderResult(Chains.Karura, ALICE)
    expect(result.error?.message).toEqual('karura is not configured')
  })

  const renderResult = (chain: Chains, address: string) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useBalances(address, chain), { wrapper })
  }
})
