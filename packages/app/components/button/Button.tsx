import styled, { css } from 'styled-components'

export interface ButtonProps {
  large?: boolean
}

const BaseButtonStyle = styled.button<ButtonProps>`
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
  transition: .25s ease-in;

  ${({ large }) => large && css`
    width: 250px;
  `}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[800]};
    color: ${({ theme }) => theme.colors.gray[600]};
    cursor: not-allowed;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.pinkDark[200]};
    background-color: ${({ theme }) => theme.colors.pinkDark[200]};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const ButtonPrimary = styled(BaseButtonStyle)<ButtonProps>`
  border: 1px solid ${({ theme }) => theme.colors.pinkLight};
  background-color: ${({ theme }) => theme.colors.pinkLight};
  color: ${({ theme }) => theme.colors.white};
`

export const ButtonOutline = styled(BaseButtonStyle)<ButtonProps>`
  border: 1px solid ${({ theme }) => theme.colors.pinkLight};
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.pinkLight};
`
