import type { ReactNode } from 'react'
import type { ObservableInput } from 'rxjs'
import type { ApiRx } from '@polkadot/api'
import type { GenericEventData, Vec } from '@polkadot/types'
import type { EventRecord, Hash, Phase } from '@polkadot/types/interfaces'
import type { ISubmittableResult } from '@polkadot/types/types'
import type { UseApi, UseTransaction } from '../src'

import { act, renderHook, RenderResult } from '@testing-library/react-hooks'
import BN from 'bn.js'
import React from 'react'
import { concatMap, delay, from, of } from 'rxjs'
import { createType } from 'test-helpers'

import { Chains, TransactionStatus, useApi, useTransaction } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'
import { mockExtensionDapp } from './mocks/mockExtensionDapp'
import { ALICE, BOB } from './consts'

describe('useTransaction hook', () => {
  it('returns tx and paymentInfo', () => {
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

    it('for ready transaction', () => {
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

      assertTransactionStatus(result, TransactionStatus.AwaitingSign)
    })

    it('for in block transaction', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      assertTransactionStatus(result, TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })
      assertTransactionStatus(result, TransactionStatus.InBlock)
    })

    it('for finalized block', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult,
        { status: { isFinalized: true }, events: [] } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      assertTransactionStatus(result, TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      assertTransactionStatus(result, TransactionStatus.Success)
      expect(result.current?.errorDetails).toBeUndefined()
    })

    it('for extrinsic error', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult,
        { status: { isFinalized: true }, events: EXTRINSIC_FAIL_EVENT } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      assertTransactionStatus(result, TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      assertTransactionStatus(result, TransactionStatus.Error)

      expect(result.current?.errorDetails).toEqual([{
        docs: 'Invalid metadata given.',
        name: 'BadMetadata',
        section: 'assets'
      }])
    })

    it('for batch error', async () => {
      const { result, waitForNextUpdate } = renderResult(createCustomApi([
        { status: { isInBlock: false }, events: [] } as unknown as ISubmittableResult,
        { status: { isInBlock: true }, events: [] } as unknown as ISubmittableResult,
        { status: { isFinalized: true }, events: BATCH_FAIL_EVENT } as unknown as ISubmittableResult
      ]))

      result.current?.tx()

      await waitForNextUpdate()

      assertTransactionStatus(result, TransactionStatus.AwaitingSign)

      act(() => {
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
        jest.runOnlyPendingTimers()
      })

      assertTransactionStatus(result, TransactionStatus.Error)

      expect(result.current?.errorDetails).toEqual([{
        docs: 'Invalid metadata given.',
        name: 'BadMetadata',
        section: 'assets'
      }])
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
      data: [{ module: { index: 34, error: 9 }, asModule: {}, isModule: true, registry: { findMetaError: () => ({ section: 'assets', name: 'BadMetadata', docs: 'Invalid metadata given.' }) } }, {
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
      data: [createType('EventId', '0x0001'), { module: { index: 34, error: 9 }, asModule: {}, isModule: true, registry: { findMetaError: () => ({ section: 'assets', name: 'BadMetadata', docs: 'Invalid metadata given.' }) } }, {
        weight: 397453000,
        class: 'Normal',
        paysFee: 'Yes'
      }] as unknown as GenericEventData
    },
    topics: [] as unknown as Vec<Hash>
  } as EventRecord
]

function assertTransactionStatus(result: RenderResult<UseTransaction | undefined>, status: TransactionStatus) {
  expect(result.current?.status).toEqual(status)
}
