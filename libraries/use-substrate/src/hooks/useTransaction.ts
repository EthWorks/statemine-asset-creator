import type { Observable } from 'rxjs'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import type { DispatchError, EventRecord, RuntimeDispatchInfo } from '@polkadot/types/interfaces'
import type { ISubmittableResult, ITuple, RegistryError } from '@polkadot/types/types'

import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'

import { useObservable } from './useObservable'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transaction = ((...args: any[]) => SubmittableExtrinsic<'rxjs'>)

type TransactionStatus = 'Ready' | 'AwaitingSign' | 'InBlock' | 'Finalized' | 'Error'

export interface UseTransaction {
  tx: () => Promise<void>
  paymentInfo: RuntimeDispatchInfo | undefined,
  status: TransactionStatus,
  errorMessage?: string[]
}

export function useTransaction(transaction: Transaction | undefined, params: unknown[], signer: string | undefined): UseTransaction | undefined {
  const [status, setStatus] = useState<TransactionStatus>('Ready')
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
    setStatus('AwaitingSign')
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
      setStatus('InBlock')
    }

    if (status.isFinalized) {
      events.forEach((event) => {
        if (isErrorEvent(event)) {
          const error = toDispatchError(event)
          const message = error ? `${error.section}.${error.name}` : 'Unknown'
          setErrorMessage(message)
        }
      })

      setStatus(isError(events) ? 'Error' : 'Finalized')
    }
  }

  const errorHandler = (): void => console.error({ type: 'ERROR', events: [] })

  transaction.subscribe({ next: statusCallback, error: errorHandler })
}

export const isErrorEvent = ({ event: { method } }: EventRecord): boolean => {
  return method === 'ExtrinsicFailed' || method === 'BatchInterrupted'
}

export const isError = (events: EventRecord[]): boolean => !!events.find(isErrorEvent)

export const toDispatchError = (event: EventRecord): RegistryError | undefined => {
  const [dispatchError] = (event.event.data as unknown) as ITuple<[DispatchError]>

  if (dispatchError.isModule) {
    return dispatchError.registry.findMetaError(dispatchError.asModule)
  }
}
