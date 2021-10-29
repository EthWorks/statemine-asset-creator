import type { ReactNode } from 'react'
import type { Transaction } from '../src'

import { ApiRx } from '@polkadot/api'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { ALICE, BOB, useTransaction } from '../src'
import { MockedApiProvider } from './mocks/MockedApiProvider'

describe('useTransaction hook', () => {
  it('returns balances', async () => {
    const { result } = renderResult(new ApiRx().tx.balances.transfer, [BOB, 123], ALICE)

    expect(result?.toString()).toEqual('10000')
  })

  const renderResult = (transaction: Transaction, params: unknown[], signer: string) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useTransaction(transaction, params, signer), { wrapper })
  }
})
