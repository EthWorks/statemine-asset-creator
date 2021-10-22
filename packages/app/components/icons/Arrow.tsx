import React from 'react'
import styled from 'styled-components'

interface ArrowProps {
  className?: string
  direction?: 'down' | 'left' | 'up' | 'right',
  width: string,
  height: string
}

export const Arrow = ({ className, direction, height, width }: ArrowProps) => (
  <ArrowWrapper className={className} width={width} height={height} viewBox='0 0 14 9' fill="none" color="currentColor">
    <ArrowIconPath
      d="M12.8337 1.5L7.00033 7.33333L1.16699 1.5"
      stroke="currentColor"
      direction={direction}
    />
  </ArrowWrapper>
)

const ArrowWrapper = styled.svg`
  preserveAspectRatio: none;
`

const ArrowIconPath = styled.path`
  transform-origin: center;
  transform: ${({ direction }) => {
    switch (direction) {
      case 'up':
        return 'rotate(180deg)'
      case 'right':
        return 'rotate(270deg)'
      case 'left':
        return 'rotate(90deg)'
      case 'down':
      default:
        return 'rotate(0deg)'
    }
  }};
`
