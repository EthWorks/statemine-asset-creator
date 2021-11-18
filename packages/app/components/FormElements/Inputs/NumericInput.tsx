import React from 'react'

import { InputBase } from './InputBase'
import { TextInputProps } from './TextInput'

export function NumericInput ({ id, label, onChange, hint, error, value, ...args }: TextInputProps): JSX.Element {
  const updateNumber: React.ChangeEventHandler<HTMLInputElement> = (event): void => {
    const val = event.target.value
    // If the current value passes the validity test then apply that to state
    if (event.target.validity.valid) {
      onChange && onChange(event.target.value)
    }
    // If the current val is just the negation sign, or it's been provided an empty string,
    // then apply that value to state - we still have to validate this input before processing
    // it to some other component or data structure, but it frees up our input the way a user
    // would expect to interact with this component
    else if (val === '' || val === '-') {
      onChange(val)
    }
  }
  
  return (
    <InputBase
      {...args}
      id={id} 
      label={label}
      hint={hint}
      error={error}
      type='tel'
      value={value}
      onChange={ updateNumber }
      pattern='^-?[0-9]\d*\.?\d*$'
    />
  )
}
