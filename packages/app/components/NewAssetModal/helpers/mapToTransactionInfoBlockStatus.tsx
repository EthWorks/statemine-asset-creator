import type { TransactionInfoBlockStatus } from '../../TransactionInfoBlock/TransactionInfoBlock'

import { TransactionStatus } from 'use-substrate'

export function mapToTransactionInfoBlockStatus(status: TransactionStatus): TransactionInfoBlockStatus {
  switch (status) {
    case TransactionStatus.AwaitingSign:
      return 'sign'
    case TransactionStatus.Success:
      return 'done'
    default:
      return 'ready'
  }
}
