import type { ReactNode } from 'react'
import type { ApiRx } from '@polkadot/api'

import { GenericEventData, Vec } from '@polkadot/types'
import { EventRecord, Hash, Phase } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { act, renderHook } from '@testing-library/react-hooks'
import BN from 'bn.js'
import React from 'react'
import { concatMap, delay, from, ObservableInput, of } from 'rxjs'
import { createType } from 'test-helpers'

import { Chains, TransactionStatus, UseApi, useApi, useTransaction } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'
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
    beforeAll(() => {
      jest.doMock('@polkadot/extension-dapp', () => mockExtensionDapp)
    })

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    afterAll(() => {
      jest.resetAllMocks()
    })

    it('for ready transaction', async () => {
      const { result } = renderResult(createCustomApi([]))
      const { status } = result.current || {}

      expect(status).toEqual(TransactionStatus.Ready)
    })

    it('for awaiting sign', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      expect(result.current?.status).toEqual(TransactionStatus.AwaitingSign)
    })

    it('for in block transaction', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      expect(result.current?.status).toEqual(TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      expect(result.current?.status).toEqual(TransactionStatus.InBlock)
    })

    it('for finalized block', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult,
        { status: { isFinalized: true }, events: [] } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      expect(result.current?.status).toEqual(TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      expect(result.current?.status).toEqual(TransactionStatus.Success)
      expect(result.current?.errorMessage).toBeUndefined()
    })

    it('for extrinsic error', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult,
        { status: { isFinalized: true }, events: EXTRINSIC_FAIL_EVENT } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      expect(result.current?.status).toEqual(TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      expect(result.current?.status).toEqual(TransactionStatus.Error)
      expect(result.current?.errorMessage).toEqual(['assets.BadMetadata'])
    })

    it('for batch error', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult,
        { status: { isFinalized: true }, events: BATCH_FAIL_EVENT } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      expect(result.current?.status).toEqual(TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      expect(result.current?.status).toEqual(TransactionStatus.Error)
      expect(result.current?.errorMessage).toEqual(['assets.BadMetadata'])
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

function createCustomApi(arg: ISubmittableResult[]): UseApi {
  return {
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
            signAndSend: () => from<ObservableInput<ISubmittableResult>>(arg)
              .pipe(concatMap(x => of(x).pipe(delay(100))))
          })
        }
      }
    } as unknown as ApiRx
  }
}
const EXTRINSIC_FAIL_EVENT: EventRecord[] = [
  {
    phase: { asApplyExtrinsic: new BN(1) } as Phase,
    event: {
      section: 'system',
      method: 'ExtrinsicFailed',
      index: createType('EventId', '0x0001'),
      data: [{ module: { index: 34, error: 9 }, asModule: {}, isModule: true, registry: { findMetaError: () => ({ section: 'assets', name: 'BadMetadata' }) } }, {
        weight: 397453000,
        class: 'Normal',
        paysFee: 'Yes'
      }] as unknown as GenericEventData
    },
    topics: [] as unknown as Vec<Hash>
  } as EventRecord
]

const BATCH_FAIL_EVENT: EventRecord[] = [
  {
    phase: { asApplyExtrinsic: new BN(1) } as Phase,
    event: {
      section: 'utility',
      method: 'BatchInterrupted',
      index: createType('EventId', '0x0001'),
      data: [createType('EventId', '0x0001'), { module: { index: 34, error: 9 }, asModule: {}, isModule: true, registry: { findMetaError: () => ({ section: 'assets', name: 'BadMetadata' }) } }, {
        weight: 397453000,
        class: 'Normal',
        paysFee: 'Yes'
      }] as unknown as GenericEventData
    },
    topics: [] as unknown as Vec<Hash>
  } as EventRecord
]
