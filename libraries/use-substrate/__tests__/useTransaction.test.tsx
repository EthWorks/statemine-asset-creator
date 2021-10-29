import type { ReactNode } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { ALICE, BOB, Chains, useApi, useTransaction } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useTransaction hook', () => {
  it('returns tx and paymentInfo', async () => {
    const { result } = renderResult( [BOB, 123], ALICE)
    const { tx, paymentInfo } = result.current || {}

    expect(tx).toBeInstanceOf(Function)

    expect(paymentInfo?.weight.toNumber()).toEqual(6)
    expect(paymentInfo?.partialFee.toNumber()).toEqual(3)
  })

  const renderResult = ( params: unknown[], signer: string) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => {
      const { api } = useApi(Chains.Kusama)

      return useTransaction(api?.tx.balances.transfer, params, signer)
    }, { wrapper })
  }
})
