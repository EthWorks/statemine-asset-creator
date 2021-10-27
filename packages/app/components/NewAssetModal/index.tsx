import React, { useState } from 'react'

import { NewAssetModalProvider } from './context/provider'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'

interface Props {
  closeModal: () => void
}

function NewAssetModal({ closeModal }: Props): JSX.Element {
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

export default NewAssetModal
