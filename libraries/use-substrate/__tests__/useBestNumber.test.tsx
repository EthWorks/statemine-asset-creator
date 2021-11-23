import type { ReactNode } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { Chains, useBestNumber } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useBestNumber hook', () => {
  it('returns current block number', async () => {
    const { result } = renderResult(Chains.Kusama)
    const bestNumber = result.current

    expect(bestNumber?.toString()).toEqual('966')
  })

  it('returns undefined when api is not connected', async () => {
    const { result } = renderResult(Chains.Statemine)
    const bestNumber = result.current

    expect(bestNumber).toEqual(undefined)
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useBestNumber(chain), { wrapper })
  }
})
