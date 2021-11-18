import React, { useMemo } from 'react'

import { CustomInputProps, InputBase } from './InputBase'

interface NumericInputProps extends Omit<CustomInputProps, 'onChange'> {
  onChange: (newValue: string) => void,
  nonDecimal?: boolean
  nonNegative?: boolean
}

const DEFAULT_PATTERN = /^-?[0-9]\d*\.?\d*$/
const NON_DECIMAL_PATTERN = /^-?[1-9]\d*$/
const NON_NEGATIVE_PATTERN = /^[0-9]\d*\.?\d*$/
const NON_DECIMAL_NON_NEGATIVE_PATTERN = /^[1-9]\d*$/

function getPattern(nonDecimal: boolean, nonNegative: boolean): RegExp {
  if (nonNegative && nonDecimal) {
    return NON_DECIMAL_NON_NEGATIVE_PATTERN
  }

  if (nonDecimal) {
    return NON_DECIMAL_PATTERN
  }
    
  if(nonNegative) {
    return NON_NEGATIVE_PATTERN
  }

  return DEFAULT_PATTERN
}

export function NumericInput ({ id, label, onChange, hint, error, value, nonDecimal = false, nonNegative = false, ...args }: NumericInputProps): JSX.Element {
  const pattern =  useMemo(() => getPattern(nonDecimal, nonNegative), [nonNegative, nonDecimal])

  const _onChange: React.ChangeEventHandler<HTMLInputElement> = (event): void => {
    const val = event.target.value
    // If the current value passes the validity test then apply that to state
    if (event.target.value.match(pattern)) {
      onChange(event.target.value)
    }
    // If the current val is just the negation sign, or it's been provided an empty string,
    // then apply that value to state - we still have to validate this input before processing
    // it to some other component or data structure, but it frees up our input the way a user
    // would expect to interact with this component
    else if ((!nonNegative && val === '-') || val === '') {
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
      onChange={_onChange}
    />
  )
}
