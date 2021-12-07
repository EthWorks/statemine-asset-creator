export interface ModalStep {
  onNext: () => void,
  onBack?: () => void
}

export interface NewAssetModalProps {
  closeModal: () => void
  isOpen: boolean,
}

export interface StaticImageData {
  src: string,
  height: number,
  width: number,
  placeholder?: string
}
