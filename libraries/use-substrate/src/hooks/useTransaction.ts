import type { Observable } from 'rxjs'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import type { DispatchError, EventRecord, RuntimeDispatchInfo } from '@polkadot/types/interfaces'
import type { ISubmittableResult, ITuple, RegistryError } from '@polkadot/types/types'

import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'

import { useObservable } from './useObservable'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transaction = ((...args: any[]) => SubmittableExtrinsic<'rxjs'>)

type TransactionStatus = 'Ready' | 'Sign' | 'Pending' | 'Finalized' | 'Error'

export interface UseTransaction {
  tx: () => Promise<void>
  paymentInfo: RuntimeDispatchInfo | undefined,
  status: TransactionStatus
}

export function useTransaction(transaction: Transaction | undefined, params: unknown[], signer: string | undefined): UseTransaction | undefined {
  const [status, setStatus] = useState<TransactionStatus>('Ready')
  const transactionPaymentInfo = useMemo(() => transaction && signer ? transaction(...params).paymentInfo(signer) : undefined,
    [transaction, signer, params])

  const paymentInfo = useObservable(transactionPaymentInfo, [transactionPaymentInfo])

  const tx = useCallback(async (): Promise<void> => {
    if (!transaction || !signer || !paymentInfo) {
      return
    }
    const fee = paymentInfo.partialFee.toBn()
    const { web3FromAddress } = await import('@polkadot/extension-dapp')

    const extension = await web3FromAddress(signer)

    observeTransaction(transaction(...params).signAndSend(signer, { signer: extension.signer }), fee)
    setStatus('Sign')
  }, [transaction, signer, paymentInfo, params])

  return {
    tx,
    paymentInfo,
    status
  }
}

const observeTransaction = (transaction: Observable<ISubmittableResult>, fee: BN): void => {
  const statusCallback = (result: ISubmittableResult): void => {
    const { status, events } = result

    if (status.isInBlock) {
      events.forEach((event) => {
        const {
          event: { data, method, section },
          phase
        } = event

        console.log('\t', JSON.stringify(phase), `: ${section}.${method}`, JSON.stringify(data))

        if (isErrorEvent(event)) {
          const error = toDispatchError(event)
          const message = error ? `${error.section}.${error.name}` : 'Unknown'

          console.log(`\t\t Error: %c${message}`, 'color: red')
        }
      })
      console.log(JSON.stringify(events))

      console.log({
        type: isError(events) ? 'ERROR' : 'SUCCESS',
        events,
        fee
      })
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
