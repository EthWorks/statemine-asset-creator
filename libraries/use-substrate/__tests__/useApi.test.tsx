import { Nodes, useApi } from '../src'
import React, { ReactNode } from 'react'
import { MockedApiProvider } from './mocks/MockedApiProvider'
import { renderHook } from '@testing-library/react-hooks'

describe('useApi', () => {
  it('returns api status for each chain', async () => {
    const { result, rerender } = renderResult(Nodes.Kusama)

    const { connectionState: kusamaConnectionState } = result.current || {}
    expect(kusamaConnectionState).toEqual('connected')

    rerender(Nodes.Statemine)

    const { connectionState: statemineConnectionState } = result.current || {}

    expect(statemineConnectionState).toEqual('connecting')
  })

  const renderResult = (chain: Nodes) => {
    const wrapper = ({ children }: { children?: ReactNode}) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook((chain ) => useApi(chain), { wrapper, initialProps: chain })
  }
})
