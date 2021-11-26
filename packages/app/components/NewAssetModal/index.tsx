import type { NewAssetModalProps } from './types'

import React, { useState } from 'react'

import { Modal } from '../Modal'
import { NewAssetModalProvider } from './context/provider'
import { StepsBar } from './StepsBar/StepsBar'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'

export function NewAssetModal({ isOpen, closeModal }: NewAssetModalProps): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(1)

  const _moveToStep = (step: number): void => {
    setActiveStep(step)
  }

  const _onClose = (): void => {
    _moveToStep(1)
    closeModal()
  }

  const renderStep: () => JSX.Element = () => {
    switch (activeStep){
      case 1: {
        return <FirstStep onNext={() => _moveToStep(2)}/>
      }
      default: {
        return <SecondStep onNext={_onClose} onBack={() => _moveToStep(1)}/>
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={_onClose}
      padding='m'
      title='Create asset'
    >
      <NewAssetModalProvider>
        <StepsBar activeStep={activeStep - 1} />
        <div>
          {renderStep()}
        </div>
      </NewAssetModalProvider>
    </Modal>
  )
}
