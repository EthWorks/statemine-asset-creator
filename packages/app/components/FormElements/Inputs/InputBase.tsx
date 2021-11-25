import React from 'react'
import styled from 'styled-components'

import { InputInfo } from './InputInfo'

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string,
  hint?: string,
  error?: string
}

export function InputBase({ id, label, hint, error, ...arg }: CustomInputProps): JSX.Element {
  return (
    <CustomInputWrapper data-testid={label}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        {...arg}
      />
      <InputInfo hint={hint} error={error} />
    </CustomInputWrapper>
  )
}

const CustomInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  
  & + & {
    margin-top: 4px;
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

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.colors.black} inset !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.white};
  }
  
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
