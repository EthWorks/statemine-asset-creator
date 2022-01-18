import type { ErrorDetails } from 'use-substrate'
import type { StepDetails } from '../types'

import { TransactionStatus } from 'use-substrate'

const DEFAULT_ERROR_MESSAGE = 'Unknown error.'

export function getCreateAssetTransactionModalDetails(status: TransactionStatus | undefined, errorDetails: ErrorDetails[] | undefined
): StepDetails {
  switch (status) {
    case (TransactionStatus.InBlock):
      return {
        name: 'Asset Creation',
        title: 'Pending transaction {txNumber}/{txNumber}...',
        text: 'Asset creation transaction is included in a block. Waiting until it is confirmed.'
      }
    case (TransactionStatus.Success):
      return {
        name: undefined,
        title: 'Congratulations!',
        text: 'Your asset has been created.'
      }
    case (TransactionStatus.Error):
      return {
        name: undefined,
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
        title: 'Pending transaction 1/2...',
        text: 'Teleport transaction is included in a block. Waiting until it is confirmed.'
      }
    case (TransactionStatus.Error):
      return {
        name: undefined,
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
