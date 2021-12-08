import type { Observable } from 'rxjs'
import type { AugmentedEvents } from '@polkadot/api/types/events'
import type { EventRecord } from '@polkadot/types/interfaces'
import type { SpRuntimeDispatchError } from '@polkadot/types/lookup'
import type { AnyTuple, IEvent, ISubmittableResult, RegistryError } from '@polkadot/types/types'
import type { ErrorDetails, ExtractTuple, Transaction, UseTransaction } from './types/useTransaction'

import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'

import { TransactionStatus } from './types/useTransaction'
import { useObservable } from './useObservable'

export function useTransaction(transaction: Transaction | undefined, params: unknown[], signer: string | undefined): UseTransaction | undefined {
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.Ready)
  const [errorDetails, setErrorDetails] = useState<ErrorDetails[]>()
  const transactionPaymentInfo = useMemo(() => transaction && signer ? transaction(...params).paymentInfo(signer) : undefined,
    [transaction, signer, params])

  const paymentInfo = useObservable(transactionPaymentInfo, [transactionPaymentInfo])

  const _setErrorDetails = (details: ErrorDetails): void => {
    if (!errorDetails) {
      setErrorDetails([details])
    } else {
      setErrorDetails([...errorDetails, details])
    }
  }

  const tx = useCallback(async (): Promise<void> => {
    if (!transaction || !signer || !paymentInfo) {
      return
    }
    const fee = paymentInfo.partialFee.toBn()
    const { web3FromAddress } = await import('@polkadot/extension-dapp')

    const extension = await web3FromAddress(signer)

    observeTransaction(transaction(...params).signAndSend(signer, { signer: extension.signer }), fee, setStatus, _setErrorDetails)
    setStatus(TransactionStatus.AwaitingSign)
  }, [transaction, signer, paymentInfo, params])

  return {
    tx,
    paymentInfo,
    status,
    errorDetails
  }
}

const observeTransaction = (transaction: Observable<ISubmittableResult>, fee: BN, setStatus: (status: TransactionStatus) => void, setErrorDetails: (details: ErrorDetails) => void): void => {
  const statusCallback = (result: ISubmittableResult): void => {
    const { status, events } = result

    if (status.isInBlock) {
      setStatus(TransactionStatus.InBlock)
    }

    if (status.isFinalized) {
      events.forEach((event) => {
        if (isErrorEvent(event)) {
          const { section, name, docs } = toDispatchError(event) || { section: 'Unknown', name: 'Unknown', docs: [] }

          setErrorDetails({ section, name, docs })
        }
      })

      setStatus(isError(events) ? TransactionStatus.Error : TransactionStatus.Success)
      subscription.unsubscribe()
    }
  }

  const errorHandler = (): void => {
    setStatus(TransactionStatus.Error)
    setErrorDetails({ section: 'Unknown', name: 'Subscription error', docs: [] })
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
