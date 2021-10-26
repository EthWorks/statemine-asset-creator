import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { PaddingSize } from '../../gloablTypes/globalTypes'
import Card from '../Card/Card'
import { ModalHeader } from './ModalHeader'

export interface ModalProps {
  children: ReactNode,
  padding?: PaddingSize,
  size?: 'm' | 'l',
  title?: string,
  titleCenterPosition?: boolean
}

const Modal = ({ children, padding, size, title, titleCenterPosition }: ModalProps): React.ReactElement<ModalProps> => {
  const onClose = (): void => console.log('close')

  return (
    <ModalView>
      <ModalBg onClick={onClose}/>
      <ModalCard size={size} padding={padding}>
        <ModalHeader title={title} onClose={onClose} titleCenterPosition={titleCenterPosition}/>
        {children}
      </ModalCard>
    </ModalView>
  )
}

export default Modal

const ModalView = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding-top: 100px;
`

const ModalBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  opacity: .6;
  backdrop-filter: blur(10px);
`

const ModalCard = styled(Card)<ModalProps>`
  overflow: hidden;
  position: relative;
  width: ${({ size }) => size === 'm' ? '500px' : '700px'};
  height: fit-content;
  color: white;
  z-index: 1;
`
