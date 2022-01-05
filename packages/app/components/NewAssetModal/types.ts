import type { UseTransaction } from 'use-substrate'
import type { TransactionStateProps } from './TransactionState/TransactionState'

export interface ModalStep {
  onNext: () => void,
  onBack?: () => void
}

export interface NewAssetModalProps {
  closeModal: () => void
  isOpen: boolean,
  openAccountSelectModal: () => void
}

export interface StaticImageData {
  src: string,
  height: number,
  width: number,
  placeholder?: string
}

export type StepDetails = Omit<TransactionStateProps, 'status' | 'onClose'> | undefined

export interface Transaction {
  transaction: UseTransaction,
  stepDetails: StepDetails
}
