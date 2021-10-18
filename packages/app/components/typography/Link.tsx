import styled from 'styled-components'

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.pink};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`
