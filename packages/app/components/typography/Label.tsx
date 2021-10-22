import styled from 'styled-components'

export const Label = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray[400]};
`
