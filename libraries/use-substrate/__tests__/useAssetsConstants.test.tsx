import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useAssetsConstants } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useAssetsConstants hook', () => {
  it('returns string limit for a chain', () => {
    const { result: { current } } = renderResult(Chains.Kusama)

    expect(current.stringLimit?.toNumber()).toEqual(50)
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useAssetsConstants(chain), { wrapper })
  }
})
