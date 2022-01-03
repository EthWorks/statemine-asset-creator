import type { NewAssetModalProps } from './types'

import React, { useState } from 'react'

import { Modal } from '../Modal'
import { NewAssetModalProvider } from './context/provider'
import { StepsBar } from './StepsBar/StepsBar'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'
import { ThirdStep } from './ThirdStep'

export function NewAssetModal({ isOpen, closeModal, openAccountSelectModal }: NewAssetModalProps): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(1)
  const [stepBarVisible, setStepBarVisible] = useState<boolean>(true)

  const _moveToStep = (step: number): void => {
    setActiveStep(step)
  }

  const _onClose = (): void => {
    _moveToStep(1)
    closeModal()
  }

  const _onOpenAccountSelectModal = (): void => {
    openAccountSelectModal()
    _onClose()
  }

  const renderStep: () => JSX.Element = () => {
    switch (activeStep) {
      case 1: {
        return <FirstStep onNext={() => _moveToStep(2)}/>
      }
      case 2: {
        return <SecondStep onNext={() => _moveToStep(3)} onBack={() => _moveToStep(1)}/>
      }
      default: {
        return <ThirdStep
          onNext={_onClose}
          onBack={() => _moveToStep(2)}
          setStepBarVisible={setStepBarVisible}
          openAccountSelectModal={_onOpenAccountSelectModal}
        />
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
        {stepBarVisible && <StepsBar activeStep={activeStep - 1} />}
        <div>
          {renderStep()}
        </div>
      </NewAssetModalProvider>
    </Modal>
  )
}
