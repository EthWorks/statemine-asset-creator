import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useChainToken } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useChainToken hook', () => {
  it('returns token and decimals', async () => {
    const { result } = renderResult(Chains.Kusama)
    const { chainToken, chainDecimals } = result.current || {}

    expect(chainDecimals).toEqual(18)
    expect(chainToken).toEqual('TT')
  })

  it('returns undefined when api is not connected', async () => {
    const { result } = renderResult(Chains.Statemine)

    expect(result.current).toBeUndefined()
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useChainToken(chain), { wrapper })
  }
})
