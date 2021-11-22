import React, { useMemo } from 'react'

import { CustomInputProps, InputBase } from './InputBase'

export type NumericInputType = 'DEFAULT' | 'INTEGER' | 'POSITIVE' | 'NATURAL'

const patterns: Record<NumericInputType, RegExp> = {
  DEFAULT: /^-?0$|^-?[1-9]\d*$|^-?0\.\d*$|^-?[1-9]\d*\.\d*$/,
  INTEGER: /^-?(0|[1-9]\d*)$/,
  POSITIVE: /^0$|^[1-9]\d*$|^0\.\d*$|^[1-9]\d*\.\d*$/,
  NATURAL: /^0$|^[1-9]\d*$/
}

interface NumericInputProps extends Omit<CustomInputProps, 'onChange'> {
  onChange: (newValue: string) => void,
  inputType?: NumericInputType
}

function getPattern(numericInputType: NumericInputType): RegExp {
  return patterns[numericInputType]
}

export function NumericInput ({ id, label, onChange, hint, error, value, inputType = 'DEFAULT', ...args }: NumericInputProps): JSX.Element {
  const pattern =  useMemo(() => getPattern(inputType), [inputType])
  const isNonNegative = useMemo(() => inputType === 'POSITIVE' || inputType === 'NATURAL', [inputType])

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
    else if ((!isNonNegative && val === '-' ) || val === '') {
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
