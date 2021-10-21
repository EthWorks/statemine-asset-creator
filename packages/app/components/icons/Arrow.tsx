import React from 'react'
import styled from 'styled-components'
import { Icon } from './Icon'

interface ArrowProps {
  className?: string
  direction?: 'down' | 'left' | 'up' | 'right'
}

export const Arrow = ({ className, direction }: ArrowProps): JSX.Element => (
  <Icon className={className} width="14" height="9" viewBox="0 0 14 9" fill="none" color="currentColor">
    <ArrowIconPath
      d="M12.8337 1.5L7.00033 7.33333L1.16699 1.5"
      stroke="currentColor"
      direction={direction}
    />
  </Icon>
)

const ArrowIconPath = styled.path<ArrowProps>`
  transform-origin: 50% 50%;
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
