import React from 'react'
import styled from 'styled-components'

import { InputHint } from './InputHint'

interface CustomInputProps<T> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string,
  onChange: (newValue: T) => void,
  hint?: string,
  error?: string
}

type CustomInputTextProps = CustomInputProps<string>

export function CustomInput({ label, id, onChange, hint, error, ...args }: CustomInputTextProps): React.ReactElement<CustomInputTextProps> {
  return (
    <CustomInputWrapper>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        onChange={event => onChange(event.currentTarget.value)}
        {...args}
      />
      <InputHint hint={hint} error={error} />
    </CustomInputWrapper>
  )
}

const CustomInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  & + & {
    margin-top: 16px;
  }
`

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background: transparent;
  font-size: 14px;
  line-height: 143%;
  color: ${({ theme }) => theme.colors.gray[50]};
  
  &:focus,
  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.colors.pinkLight};
    border-color: ${({ theme }) => theme.colors.pinkLight};
    caret-color: ${({ theme }) => theme.colors.pinkLight};
  }
`

const InputLabel = styled.label`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 143%;
  color: ${({ theme }) => theme.colors.gray[400]};
`
