import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { ALICE, useBalances } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useBalances hook', () => {
  it('returns balances', async () => {
    const { result } = renderResult()
    const { freeBalance, accountNonce, accountId } = result.current || {}

    expect(freeBalance?.toString()).toEqual('10000')
    expect(accountNonce?.toString()).toEqual('3')
    expect(accountId?.toString()).toEqual(ALICE)
  })

  const renderResult = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useBalances(ALICE), { wrapper })
  }
})
