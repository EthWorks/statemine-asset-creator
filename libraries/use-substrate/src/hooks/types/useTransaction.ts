import type {AugmentedEvent, SubmittableExtrinsic} from '@polkadot/api/types'
import type {RuntimeDispatchInfo} from '@polkadot/types/interfaces'
import {TransactionStatus} from "../../consts";

export type ExtractTuple<P> = P extends AugmentedEvent<'rxjs', infer T> ? T : never

export interface ErrorDetails {
  section: string;
  name: string;
  docs: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transaction = ((...args: any[]) => SubmittableExtrinsic<'rxjs'>)

export interface UseTransaction {
  tx: () => Promise<void>
  paymentInfo: RuntimeDispatchInfo | undefined,
  status: TransactionStatus,
  errorDetails?: ErrorDetails[]
}
