import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { Chains, useCreateAssetDeposit } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

const NAME = 'test token'
const SYMBOL = 'TT'

describe('useCreateAssetDeposit hook', () => {
  it('returns deposit for create asset', async () => {
    const { result } = renderResult(Chains.Kusama, NAME, SYMBOL)
    const deposit = result.current

    expect(deposit?.toString()).toEqual('320')
  })

  it('returns deposit for create asset', async () => {
    const { result } = renderResult(Chains.Kusama, NAME + '👻', SYMBOL)
    const deposit = result.current

    expect(deposit?.toString()).toEqual('360')
  })

  it('returns undefined when api is not connected', async () => {
    const { result } = renderResult(Chains.Statemine, NAME, SYMBOL)
    const deposit = result.current

    expect(deposit).toBeUndefined()
  })

  const renderResult = (chain: Chains, name: string, symbol: string) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useCreateAssetDeposit(chain, name, symbol), { wrapper })
  }
})
