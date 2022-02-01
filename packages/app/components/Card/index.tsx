import styled from 'styled-components'

import { PaddingSize } from '../../globalTypes'
import { ColorType } from '../../styles/styleVariables'

export interface CardProps {
  padding?: PaddingSize,
  color?: ColorType
}

export const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme, color }) => color ? theme.colors[color] : theme.colors.black};
  padding: ${({ padding }) => padding ? paddingSizes[padding] : '0px'};
};
`
const paddingSizes: Record<PaddingSize, string> = {
  s: '16px',
  m: '24px 32px',
  l: '40px'
}
