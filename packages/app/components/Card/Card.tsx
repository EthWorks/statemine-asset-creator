import styled from 'styled-components'

export interface CardProps {
  className?: string,
  padding?: 's' | 'm' | 'l'
}

const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.black};
  padding: ${({ padding }) => {
    switch (padding) {
      case 's':
        return '16px'
      case 'm':
        return '24px 32px'
      case 'l':
        return '40px'
      default:
        return '0px'
    }
  }};
`

export default Card
