import React from 'react'
import styled from 'styled-components'

interface ArrowLargeProps {
  className?: string
  direction?: 'down' | 'left' | 'up' | 'right',
  width: string,
  height: string
}

export const ArrowLarge = ({ className, direction, height, width }: ArrowLargeProps): JSX.Element => (
  <ArrowWrapper className={className} width={width} height={height} viewBox="0 0 25 24" fill="none" color="currentColor">
    <ArrowIconPath
      d="M17.5 8L21.5 12M21.5 12L17.5 16M21.5 12H3.5"
      stroke="currentColor"
      troke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      direction={direction}
    />
  </ArrowWrapper>
)

// #E6007A

const ArrowWrapper = styled.svg`
  preserveAspectRatio: none;
`

const ArrowIconPath = styled.path`
  transform-origin: center;
  transform: ${({ direction }) => {
    switch (direction) {
      case 'up':
        return 'rotate(270deg)'
      case 'right':
        return 'rotate(0deg)'
      case 'left':
        return 'rotate(180deg)'
      case 'down':
        return 'rotate(90deg)'
      default:
        return 'rotate(0deg)'
    }
  }};
`
