import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useBalancesConstants } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useBalancesConstants hook', () => {
  it('returns existential deposit for a chain', () => {
    const { result: { current } } = renderResult(Chains.Kusama)

    expect(current?.existentialDeposit?.toNumber()).toEqual(120)
  })

  it('returns undefined when api is not connected', () => {
    const { result: { current } } = renderResult(Chains.Statemine)

    expect(current?.existentialDeposit).toBeUndefined()
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useBalancesConstants(chain), { wrapper })
  }
})
