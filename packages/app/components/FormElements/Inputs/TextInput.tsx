import React from 'react'

import { CustomInputProps, InputBase } from './InputBase'

interface TextInputProps extends Omit<CustomInputProps, 'onChange'> {
  onChange: (newValue: string) => void,
}

export function TextInput({ onChange, ...args }: TextInputProps):JSX.Element {
  return (
    <InputBase
      type='text'
      onChange={event => onChange(event.currentTarget.value)}
      {...args}
    />
  )
}
