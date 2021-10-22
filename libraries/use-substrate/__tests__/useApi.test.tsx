import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useApi } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useApi', () => {
  it('returns api status for each chain', async () => {
    const { result, rerender } = renderResult(Chains.Kusama)
    const { connectionState: kusamaConnectionState } = result.current || {}

    expect(kusamaConnectionState).toEqual('connected')

    rerender(Chains.Statemine)
    const { connectionState: statemineConnectionState } = result.current || {}

    expect(statemineConnectionState).toEqual('connecting')
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children?: ReactNode}) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook((chain ) => useApi(chain), { wrapper, initialProps: chain })
  }
})
