import React from 'react'
import styled from 'styled-components'

import { CloseButton } from '../button/CloseButton'
import { Header } from '../typography/Header'

interface ModalHeaderProps {
  onClose: () => void,
  title?: string,
  titleCenterPosition?: boolean,
}

export const ModalHeader = ({ onClose, title, titleCenterPosition }: ModalHeaderProps): React.ReactElement<ModalHeaderProps> => (
  <WrapperModalHeader titleCenterPosition={titleCenterPosition}>
    <Header>{title}</Header>
    <ModalCloseBtn onClick={onClose}>X</ModalCloseBtn>
  </WrapperModalHeader>
)

const WrapperModalHeader = styled.header<Pick<ModalHeaderProps, 'titleCenterPosition'>>`
  position: relative;
  display: flex;
  justify-content: ${({ titleCenterPosition }) => titleCenterPosition ? 'center' : 'flex-start'};
  margin-bottom: 24px;
  width: 100%;
`

const ModalCloseBtn = styled(CloseButton)`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
`
