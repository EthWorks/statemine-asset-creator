export interface ModalStep {
  onNext: () => void
}

export interface NewAssetModalProps {
  closeModal: () => void
  isOpen: boolean,
}
