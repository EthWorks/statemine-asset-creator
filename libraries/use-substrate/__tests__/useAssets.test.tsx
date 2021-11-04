import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { ALICE, BOB, Chains, useAssets } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('Use assets hook', () => {
  it('Returns all available assets', () => {
    const { result } = renderResult()

    expect(result.current).toHaveLength(3)

    const { id: firstId, owner: firstOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[0]
    const { id: secondId, owner: secondOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[1]
    const { id: thirdId, owner: thirdOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[2]

    expect(firstId).toEqual('15')
    expect(firstOwner).toEqual(BOB)
    expect(secondId).toEqual('24')
    expect(secondOwner).toEqual(ALICE)
    expect(thirdId).toEqual('37')
    expect(thirdOwner).toEqual(BOB)
  })

  it('Returns owners assets', async () => {
    const { result } = renderResult(BOB)

    expect(result.current).toHaveLength(2)

    const { id: firstId, owner: firstOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[0]
    const { id: secondId, owner: secondOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[1]

    expect(firstId).toEqual('15')
    expect(firstOwner).toEqual(BOB)
    expect(secondId).toEqual('37')
    expect(secondOwner).toEqual(BOB)
  })

  const renderResult = (owner?: string) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useAssets(Chains.Kusama, { owner }), { wrapper })
  }
})
