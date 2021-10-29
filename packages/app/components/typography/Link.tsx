import styled from 'styled-components'

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.pinkLight};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`
