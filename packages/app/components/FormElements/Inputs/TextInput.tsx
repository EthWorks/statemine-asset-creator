import React from 'react'

import { CustomInputProps, InputBase } from './InputBase'

export interface TextInputProps extends Omit<CustomInputProps, 'onChange'> {
  onChange: (newValue: string) => void,
}

export function TextInput({ label, id, onChange, hint, error, ...args }: TextInputProps): React.ReactElement<TextInputProps> {
  return (
    <InputBase 
      type='text' 
      label={label}         
      onChange={event => onChange(event.currentTarget.value)}
      hint={hint} 
      error={error}  
      id={id} {...args}
    />
  )
}
