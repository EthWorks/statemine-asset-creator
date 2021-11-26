export interface ModalStep {
  onNext: () => void,
  onBack?: () => void
}

export interface NewAssetModalProps {
  closeModal: () => void
  isOpen: boolean,
}
