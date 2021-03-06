import React from 'react'
import styled, { css } from 'styled-components'

import { TooltipBox } from '../../Tooltip'
import { InputInfo } from './InputInfo'

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string,
  large?: boolean,
  hint?: string,
  error?: string,
  button?: {
    label: string,
    onClick: () => void
  },
  tooltip?: string
}

export function InputBase({ id, label, hint, error, large, className, button, tooltip, ...arg }: CustomInputProps): JSX.Element {
  return (
    <CustomInputWrapper data-testid={label} className={className}>
      <LabelWrapper>
        {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
        {tooltip && <StyledTooltip text={tooltip}/>}
      </LabelWrapper>
      {button && <StyledLink type='button' onClick={button.onClick}>{button.label}</StyledLink>}
      <Input
        id={id}
        large={large}
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

const Input = styled.input<Pick<CustomInputProps, 'large'>>`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray600};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background: transparent;
  font-size: 14px;
  line-height: 143%;
  color: ${({ theme }) => theme.colors.gray50};

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
  
  ${({ large }) => large && css`
    font-size: 24px;
    line-height: 24px;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.none};
    padding-left: 0;

    &:focus,
    &:focus-visible {
      outline: none;
      border: none;
      caret-color: ${({ theme }) => theme.colors.pinkLight};
    }
    
    &::placeholder {
      font-family: 'Space Grotesk', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      color: ${({ theme }) => theme.colors.gray600};
    }
  `}
`

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  line-height: 143%;
  color: ${({ theme }) => theme.colors.gray400};
`

const StyledLink = styled.button`
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.pinkLight};

  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;

  position: absolute;
  top: 0;
  right: 0;
  
  &:hover {
    text-decoration: underline;
  }
`

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`

const StyledTooltip = styled(TooltipBox)`
  margin-left: 5.6px;
`
