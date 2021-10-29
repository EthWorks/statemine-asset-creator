import type { ReactNode } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { ALICE, BOB, Chains, useApi, useTransaction } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useTransaction hook', () => {
  it('returns tx and paymentInfo', async () => {
    const { result } = renderResult( )
    const { tx, paymentInfo } = result.current || {}

    expect(tx).toBeInstanceOf(Function)

    expect(paymentInfo?.weight.toNumber()).toEqual(6)
    expect(paymentInfo?.partialFee.toNumber()).toEqual(3)
  })

  const renderResult = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => {
      const { api } = useApi(Chains.Kusama)

      return useTransaction(api?.tx.balances.transfer,  [BOB, 123], ALICE)
    }, { wrapper })
  }
})
