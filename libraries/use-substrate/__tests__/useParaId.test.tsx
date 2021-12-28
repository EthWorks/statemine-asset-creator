import { ApiRx } from '@polkadot/api'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, UseApi, useParaId } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'

describe('useParaId hook', () => {
  it('returns undefined when api is not connected', async () => {
    const { result } = renderResult(Chains.Statemine)

    expect(result.current).toBeUndefined()
  })

  it('returns parachain id', async () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.toString()).toEqual('12')
  })

  it('return undefined for relay chain', async () => {
    const { result } = renderResult(Chains.Kusama, relayChainApi)

    expect(result.current).toBeUndefined()
  })

  const renderResult = (chain: Chains, customApi?: UseApi) => {
    const wrapper = ({ children }: { children?: ReactNode}) => (
      <MockedApiProvider customApi={customApi}>
        {children}
      </MockedApiProvider>
    )

    return renderHook((chain) => useParaId(chain), { wrapper, initialProps: chain })
  }
})

const relayChainApi: UseApi = {
  ...mockedKusamaApi,
  api: {
    ...mockedKusamaApi.api,
    query: {
      ...mockedKusamaApi.api?.query,
      parachainInfo: undefined
    }
  } as unknown as ApiRx,
  isConnected: true,
  connectionState: 'connected'
}
