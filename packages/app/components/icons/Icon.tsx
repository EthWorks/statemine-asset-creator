import styled from 'styled-components'

interface IconProps {
  width: string
  height: string
}

export const Icon = styled.svg<IconProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  position: relative;
`
