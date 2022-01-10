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
        text: 'It takes time to create your asset. In order to do so, we need to create a transaction and wait until blockchain validates it.'
      }
    case (TransactionStatus.Success):
      return {
        name: undefined,
        title: 'Congratulations!',
        text: 'Your asset have been created.'
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
        text: 'It takes time to teleport. In order to do so, we need to create a transaction and wait until blockchain validates it.'
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
