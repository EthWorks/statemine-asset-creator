import { SubmittableExtrinsic } from '@polkadot/api/types'
import { DispatchError, EventRecord, RuntimeDispatchInfo } from '@polkadot/types/interfaces'
import { ISubmittableResult, ITuple, RegistryError } from '@polkadot/types/types'
import BN from 'bn.js'
import { Observable } from 'rxjs'

import { useObservable } from './useObservable'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transaction = ((...args: any[]) => SubmittableExtrinsic<'rxjs'>)

export function useTransfer(transaction: Transaction | undefined, params: unknown[], signer: string | null): {tx: () => Promise<void>, paymentInfo: RuntimeDispatchInfo | undefined} | undefined {
  if (!transaction || !signer) {
    return
  }

  const paymentInfo = useObservable((transaction(...params)).paymentInfo(signer), [transaction, signer, params])

  const tx = async (): Promise<void> => {
    if (!transaction || !paymentInfo) {
      return
    }

    const fee = paymentInfo.partialFee.toBn()
    const { web3FromAddress } = await import('@polkadot/extension-dapp')

    const extension = await web3FromAddress(signer)
    observeTransaction(transaction(...params).signAndSend(signer, { signer: extension.signer }), fee)
    console.log('SIGN_EXTERNAL')
  }

  return {
    tx,
    paymentInfo,
  }
}

const observeTransaction = (transaction: Observable<ISubmittableResult>, fee: BN): void => {
  const statusCallback = (result: ISubmittableResult): void => {
    const { status, events } = result

    if (status.isInBlock) {
      events.forEach((event) => {
        const {
          event: { data, method, section },
          phase,
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
