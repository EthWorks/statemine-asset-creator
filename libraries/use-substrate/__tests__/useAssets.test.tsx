import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { BOB, Chains, useAssets } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('Use assets hook', () => {
  it('Returns all available assets', () => {
    const { result } = renderResult()

    expect(result.current).toHaveLength(1)

    const { id, owner } = (result.current ?? [{ id: undefined, owner: undefined }])[0]

    expect(owner).toEqual(BOB)
    expect(id).toEqual('15')
  })

  const renderResult = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useAssets(Chains.Kusama), { wrapper })
  }
})
