import React from 'react'

interface CustomInputProps<T> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string,
  onChange: (newValue: T) => void,
}

export type CustomInputTextProps = CustomInputProps<string>

export function CustomInput({ label, id, onChange, ...args }: CustomInputTextProps): React.ReactElement<CustomInputTextProps> {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        onChange={event => onChange(event.currentTarget.value)}
        {...args}
      />
    </>
  )
}
