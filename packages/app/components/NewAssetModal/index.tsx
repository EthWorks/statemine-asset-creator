import type { NewAssetModalProps } from './types'

import React, { useState } from 'react'

import { Modal } from '../Modal'
import { NewAssetModalProvider } from './context/provider'
import { StepsBar } from './StepsBar/StepsBar'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'

export function NewAssetModal({ isOpen, closeModal }: NewAssetModalProps): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0)

  const _moveToStep = (step: number): void => {
    setActiveStep(step)
  }

  const _onConfirm = (): void => {
    _moveToStep(0)
    closeModal()
  }

  const renderStep: () => JSX.Element = () => {
    switch (activeStep){
      case 0: {
        return <FirstStep onNext={() => _moveToStep(1)}/>
      }
      default: {
        return <SecondStep onNext={_onConfirm}/>
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      padding='m'
      title='Create asset'
    >
      <NewAssetModalProvider>
        <StepsBar activeStep={activeStep} />
        <div>
          {renderStep()}
        </div>
      </NewAssetModalProvider>
    </Modal>
  )
}
