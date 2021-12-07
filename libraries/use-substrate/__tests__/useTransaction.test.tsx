import type { ReactNode } from 'react'

import { ApiRx } from '@polkadot/api'
import { renderHook } from '@testing-library/react-hooks'
import BN from 'bn.js'
import React from 'react'
import { of } from 'rxjs'
import { createType } from 'test-helpers'

import { Chains, UseApi, useApi, useTransaction } from '../src'
import { MockedApiProvider, mockedKusamaApi, noop } from './mocks/MockedApiProvider'
import { ALICE, BOB } from './consts'

const mockExtensionDapp = {
  web3Enable: async () => ({}),
  web3AccountsSubscribe: async () => ({}),
  web3Accounts: async () => [],
  web3FromAddress: () => ({
    signer: ALICE
  })
}

describe('useTransaction hook', () => {
  it('returns tx and paymentInfo', async () => {
    const { result } = renderResult()
    const { tx, paymentInfo } = result.current || {}

    expect(tx).toBeInstanceOf(Function)

    expect(paymentInfo?.weight.toNumber()).toEqual(6)
    expect(paymentInfo?.partialFee.toNumber()).toEqual(3)
  })

  describe('transaction state', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('for ready transaction', async () => {
      const { result } = renderResult(customApi)
      const { status } = result.current || {}

      expect(status).toEqual('Ready')
    })

    it('for awaiting sign', async () => {
      jest.doMock('@polkadot/extension-dapp', () => mockExtensionDapp)

      const { result, waitForNextUpdate } = renderResult(customApi)
      result.current?.tx()

      await waitForNextUpdate()

      expect(result.current?.status).toEqual('Sign')
    })
  })

  const renderResult = (customApi?: UseApi) => {
    const params = [BOB, 123]
    const signer = ALICE

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider customApi={customApi}>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => {
      const { api } = useApi(Chains.Kusama)

      return useTransaction(api?.tx.balances.transfer, params, signer)
    }, { wrapper })
  }
})

const customApi: UseApi = {
  isConnected: true,
  connectionState: 'connected',
  api: {
    ...mockedKusamaApi.api,
    tx: {
      ...mockedKusamaApi.api?.tx,
      balances: {
        transfer: () => ({
          paymentInfo: () => of(createType('RuntimeDispatchInfo', {
            weight: 6,
            partialFee: new BN(3)
          })),
          signAndSend: () => ({ subscribe: () => noop })
        })
      }
    }
  } as unknown as ApiRx
}
