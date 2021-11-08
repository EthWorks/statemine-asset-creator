import styled from 'styled-components'

import { ColorType } from '../../styles/styleVariables'

interface TitleProps {
  color?: ColorType
}

export const Title = styled.h3<TitleProps>`
  position: relative;
  display: flex;
  padding: 0 10px;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme, color }) => color ? theme.colors[color] : theme.colors.gray[500]};
  z-index: 1;
`
