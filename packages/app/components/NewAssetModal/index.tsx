import React, { useState } from 'react'

import { NewAssetModalProvider } from './context/provider'
import { FirstStep } from './FirstStep'
import { SecondStep } from './SecondStep'

function NewAssetModal(): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(1)

  const moveToStep = (step: number): void => {
    setActiveStep(step)
  }

  const renderStep: () => JSX.Element | undefined = () => {
    switch (activeStep){
      case 1: {
        return <FirstStep onNext={() => moveToStep(2)}/>
      }
      case 2: {
        return <SecondStep/>
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
