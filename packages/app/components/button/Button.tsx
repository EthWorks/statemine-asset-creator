import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

export interface ButtonProps {
  children: ReactNode,
  disabled?: boolean,
  onClick?: () => void,
  large?: boolean
}

export const ButtonPrimary = ({ children, disabled, onClick, large }: ButtonProps): React.ReactElement<ButtonProps> => (
  <StyleButtonPrimary large={large} disabled={disabled} onClick={onClick}>
    {children}
  </StyleButtonPrimary>
)

export const ButtonOutline = ({ children, disabled, onClick, large }: ButtonProps): React.ReactElement<ButtonProps> => (
  <StyleButtonOutline large={large} disabled={disabled} onClick={onClick}>
    {children}
  </StyleButtonOutline>
)

export const BaseButtonStyle = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 8px;
  padding: 8px 16px;
  width: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;

  ${({ large }) => large && css`
    width: 250px;
  `}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[800]};
    color: ${({ theme }) => theme.colors.gray[600]};
    cursor: not-allowed;
  }
`

const StyleButtonPrimary = styled(BaseButtonStyle)<ButtonProps>`
  border: 1px solid ${({ theme }) => theme.colors.pink};
  background-color: ${({ theme }) => theme.colors.pink};
  color: ${({ theme }) => theme.colors.white};
`

const StyleButtonOutline = styled(BaseButtonStyle)<ButtonProps>`
  border: 1px solid ${({ theme }) => theme.colors.pink};
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.pink};
`
