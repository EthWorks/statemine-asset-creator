import React from 'react'
import styled from 'styled-components'

interface LinkProps {
  href: string
  children: string
  className?: string
}

const Link = ({ className, children, href }: LinkProps) => (
  <StyledLink className={className} href={href}>{children}</StyledLink>
)

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.pink};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

export default Link
