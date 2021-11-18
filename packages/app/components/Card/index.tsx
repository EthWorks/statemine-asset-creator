import styled from 'styled-components'

import { PaddingSize } from '../../globalTypes'

export interface CardProps {
  padding?: PaddingSize
}

export const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.black};
  padding: ${({ padding }) => padding ? paddingSizes[padding] : '0px'};
};
`
const paddingSizes: Record<PaddingSize, string> = {
  s: '16px',
  m: '24px',
  l: '40px'
}
