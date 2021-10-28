import styled from 'styled-components'

import { PaddingSize } from '../../gloablTypes/globalTypes'

export interface CardProps {
  padding?: PaddingSize
}

const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.black};
  padding: ${({ padding }) => padding ? paddingSizes[padding] : '0px'};
};
`
const paddingSizes: Record<PaddingSize, string> = {
  s: '16px',
  m: '24px 32px',
  l: '40px'
}

export default Card
