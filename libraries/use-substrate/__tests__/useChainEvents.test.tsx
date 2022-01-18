import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useApi, useChainEvents } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useChainEvents hook', () => {
  it('returns emitted event block number', async () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.blockHash).toEqual('somestring')
  })

  it('returns undefined if api is not connected', async () => {
    const { result } = renderResult(Chains.Statemine)

    expect(result.current).toBeUndefined()
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => {
      const { api } = useApi(Chains.Kusama)

      return useChainEvents(chain, [api?.events.assets.Created])
    }, { wrapper })
  }
})
