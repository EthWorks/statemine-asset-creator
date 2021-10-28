import { ApiRx } from '@polkadot/api'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'

import { ALICE, BOB, Transaction, useTransfer } from '../src'
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

    return renderHook(() => useTransfer(transaction, params, signer), { wrapper })
  }
})
