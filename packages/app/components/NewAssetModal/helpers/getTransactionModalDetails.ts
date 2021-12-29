import type { ErrorDetails } from 'use-substrate'
import type { TransactionStateProps } from '../TransactionState/TransactionState'

import { TransactionStatus } from 'use-substrate'

export type StepDetails = Omit<TransactionStateProps, 'status' | 'onClose'> | undefined

const DEFAULT_ERROR_MESSAGE = 'Unknown error.'

export function getCreateAssetTransactionModalDetails(status: TransactionStatus | undefined, errorDetails: ErrorDetails[] | undefined
): StepDetails {
  switch (status) {
    case (TransactionStatus.InBlock):
      return {
        name: 'Asset Creation',
        number: 1,
        title: 'Pending transaction 1/1...',
        text: 'It takes time to create your asset. In order to do so, we need to create a transaction and wait until blockchain validates it.'
      }
    case (TransactionStatus.Success):
      return {
        name: undefined,
        number: undefined,
        title: 'Congratulations!',
        text: 'Your asset have been created.'
      }
    case (TransactionStatus.Error):
      return {
        name: undefined,
        number: undefined,
        title: 'Something went wrong',
        text: errorDetails ? formatErrorDetails(errorDetails) : DEFAULT_ERROR_MESSAGE
      }
    default:
      return undefined
  }
}

export function getTeleportTransactionModalDetails(status: TransactionStatus | undefined, errorDetails: ErrorDetails[] | undefined
): StepDetails {
  switch (status) {
    case (TransactionStatus.InBlock):
      return {
        name: 'Teleport',
        number: 1,
        title: 'Pending transaction 1/2...',
        text: 'It takes time to teleport. In order to do so, we need to create a transaction and wait until blockchain validates it.'
      }
    case (TransactionStatus.Error):
      return {
        name: undefined,
        number: undefined,
        title: 'Something went wrong',
        text: errorDetails ? formatErrorDetails(errorDetails) : DEFAULT_ERROR_MESSAGE
      }
    default:
      return undefined
  }
}

function formatErrorDetails(errorDetails: ErrorDetails[]): string {
  return errorDetails.map(({ docs, section, name }) => {
    const firstPart = section && name ? `${section}.${name}` : `${section}${name}`
    const secondPart = docs.length !== 0 ? (`: ${docs.join(' ')}`) : ''

    return `[${firstPart}]${secondPart}`
  }).join('\n')
}
