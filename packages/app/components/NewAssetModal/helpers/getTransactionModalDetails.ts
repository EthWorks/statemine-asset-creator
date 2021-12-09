import type { StatusStepProps } from '../StatusStep/StatusStep'

import { TransactionStatus } from 'use-substrate'

export type StepDetails = Omit<StatusStepProps, 'status'> | undefined

export function getTransactionModalDetails(status: TransactionStatus | undefined): StepDetails {
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
        text: 'Lorem ipsum'
      }
    default:
      return undefined
  }
}
