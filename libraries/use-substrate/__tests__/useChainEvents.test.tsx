import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode, useMemo } from 'react'

import { Chains, useApi, useChainEvents } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useChainEvents hook', () => {
  it('returns emitted events', async () => {
    const { result } = renderResult(Chains.Kusama)
    expect(result.current?.events[0].event.section).toEqual('assets')
    expect(result.current?.events[0].event.method).toEqual('Created')
  })

  it('returns emitted event block number', async () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.blockHash).toEqual('0x38020a026d6f646c506f745374616b650038020a026d6f646c506f745374616b')
  })

  it('filters out events not passing checks', async () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.events).toHaveLength(1)
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
      const checks = useMemo(() => [api?.events.assets.Created], [api])

      return useChainEvents(chain, checks)
    }, { wrapper })
  }
})
