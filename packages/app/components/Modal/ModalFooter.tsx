import styled from 'styled-components'

interface ModalFooterProps {
  contentPosition?: 'right' | 'between'
}
export const ModalFooter = styled.footer<ModalFooterProps>`
  display: flex;
  margin-top: 24px;
  justify-content: ${({ contentPosition }) => contentPosition === 'between' ? 'space-between' : 'flex-end'};
`
