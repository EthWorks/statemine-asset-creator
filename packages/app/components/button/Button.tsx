import styled, { css } from 'styled-components'

export interface ButtonProps {
  large?: boolean
}

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
  transition: .25s ease-in;

  ${({ large }) => large && css`
    width: 250px;
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.pinkDark};
    background-color: ${({ theme }) => theme.colors.pinkDark};
    color: ${({ theme }) => theme.colors.white};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[800]};
    border-color: ${({ theme }) => theme.colors.gray[800]};
    color: ${({ theme }) => theme.colors.gray[600]};
    cursor: not-allowed;
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

export const ButtonSquare = styled(BaseButtonStyle)`
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
`

export const ButtonTertiary = styled(BaseButtonStyle)<ButtonProps>`
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.pinkLight};
`
