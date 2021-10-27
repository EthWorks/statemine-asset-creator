import type { NewAssetModalProps } from './types'

import React, { useState } from 'react'

import { NewAssetModalProvider } from './context/provider'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'

export function NewAssetModal({ closeModal }: NewAssetModalProps): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(1)

  const _moveToStep = (step: number): void => {
    setActiveStep(step)
  }

  const renderStep: () => JSX.Element = () => {
    switch (activeStep){
      case 1: {
        return <FirstStep onNext={() => _moveToStep(2)}/>
      }
      default: {
        return <SecondStep onNext={closeModal}/>
      }
    }
  }

  return (
    <NewAssetModalProvider>
      <div>
        {renderStep()}
      </div>
    </NewAssetModalProvider>
  )
}
