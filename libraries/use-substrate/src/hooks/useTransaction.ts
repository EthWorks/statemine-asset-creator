import type { Observable } from 'rxjs'
import type { AugmentedEvent, SubmittableExtrinsic } from '@polkadot/api/types'
import type { AugmentedEvents } from '@polkadot/api/types/events'
import type { EventRecord, RuntimeDispatchInfo } from '@polkadot/types/interfaces'
import type { SpRuntimeDispatchError } from '@polkadot/types/lookup'
import type { AnyTuple, IEvent, ISubmittableResult, RegistryError } from '@polkadot/types/types'

import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'

import { useObservable } from './useObservable'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transaction = ((...args: any[]) => SubmittableExtrinsic<'rxjs'>)

export enum TransactionStatus {
  Ready= 'Ready',
  AwaitingSign= 'AwaitingSign',
  InBlock = 'InBlock',
  Success = 'Success',
  Error = 'Error'
}

type ExtractTuple<P> = P extends AugmentedEvent<'rxjs', infer T> ? T : never

export interface UseTransaction {
  tx: () => Promise<void>
  paymentInfo: RuntimeDispatchInfo | undefined,
  status: TransactionStatus,
  errorMessage?: string[]
}

export function useTransaction(transaction: Transaction | undefined, params: unknown[], signer: string | undefined): UseTransaction | undefined {
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.Ready)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  const transactionPaymentInfo = useMemo(() => transaction && signer ? transaction(...params).paymentInfo(signer) : undefined,
    [transaction, signer, params])

  const paymentInfo = useObservable(transactionPaymentInfo, [transactionPaymentInfo])

  const _setError = (error: string): void => {
    if (!errorMessage) {
      setErrorMessage([error])
    } else {
      setErrorMessage([...errorMessage, error])
    }
  }

  const tx = useCallback(async (): Promise<void> => {
    if (!transaction || !signer || !paymentInfo) {
      return
    }
    const fee = paymentInfo.partialFee.toBn()
    const { web3FromAddress } = await import('@polkadot/extension-dapp')

    const extension = await web3FromAddress(signer)

    observeTransaction(transaction(...params).signAndSend(signer, { signer: extension.signer }), fee, setStatus, _setError)
    setStatus(TransactionStatus.AwaitingSign)
  }, [transaction, signer, paymentInfo, params])

  return {
    tx,
    paymentInfo,
    status,
    errorMessage
  }
}

const observeTransaction = (transaction: Observable<ISubmittableResult>, fee: BN, setStatus: (status: TransactionStatus) => void, setErrorMessage: (message: string) => void): void => {
  const statusCallback = (result: ISubmittableResult): void => {
    const { status, events } = result

    if (status.isInBlock) {
      setStatus(TransactionStatus.InBlock)
    }

    if (status.isFinalized) {
      events.forEach((event) => {
        if (isErrorEvent(event)) {
          const error = toDispatchError(event)
          const message = error ? `${error.section}.${error.name}` : 'Unknown'

          setErrorMessage(message)
        }
      })

      setStatus(isError(events) ? TransactionStatus.Error : TransactionStatus.Success)
      subscription.unsubscribe()
    }
  }

  const errorHandler = (): void => {
    setStatus(TransactionStatus.Error)
    setErrorMessage('Subscription error')
  }

  const subscription = transaction.subscribe({ next: statusCallback, error: errorHandler })
}

export const isErrorEvent = ({ event: { method } }: EventRecord): boolean => {
  return method === 'ExtrinsicFailed' || method === 'BatchInterrupted'
}

export const isError = (events: EventRecord[]): boolean => !!events.find(isErrorEvent)

export const toDispatchError = (event: EventRecord): RegistryError | undefined => {
  if (isModuleEvent(event.event, 'utility', 'BatchInterrupted')) {
    const [, error] = event.event.data

    return getErrorMeta(error)
  }

  if (isModuleEvent(event.event, 'system', 'ExtrinsicFailed')) {
    const [error] = event.event.data

    return getErrorMeta(error)
  }
}

export const isModuleEvent = <
  Module extends keyof AugmentedEvents<'rxjs'>,
  Event extends keyof AugmentedEvents<'rxjs'>[Module],
  Tuple extends ExtractTuple<AugmentedEvents<'rxjs'>[Module][Event]>
>(
  event: IEvent<AnyTuple>,
  module: Module,
  eventName: Event
): event is IEvent<Tuple> => event.section === module && event.method === eventName

const getErrorMeta = (error: SpRuntimeDispatchError): RegistryError | undefined => {
  if (error.isModule) {
    return error.registry.findMetaError(error.asModule)
  }
}
