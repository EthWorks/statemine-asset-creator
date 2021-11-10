import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useStringLimit } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useStringLimit hook', () => {
  it('returns string limit for a chain', () => {
    const { result: { current } } = renderResult(Chains.Kusama)

    expect(current?.toNumber()).toEqual(50)
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useStringLimit(chain), { wrapper })
  }
})
