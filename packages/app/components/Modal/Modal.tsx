import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { PaddingSize } from '../../gloablTypes/globalTypes'
import Card from '../Card/Card'
import { ModalHeader } from './ModalHeader'

export type ModalSize = 'm' | 'l'

export interface ModalProps {
  children: ReactNode,
  headerOverModal?: ReactNode,
  padding?: PaddingSize,
  size?: ModalSize,
  title?: string,
  titleCenterPosition?: boolean,
  isOpen: boolean,
  onClose: () => void
}

interface ModalCardProps {
  padding?: PaddingSize,
  size?: ModalSize,
}

const Modal = ({ children, padding, size, title, titleCenterPosition, headerOverModal, isOpen, onClose }: ModalProps) => {
  const _onClose = () => onClose()

  if (!isOpen) return null

  return (
    <ModalView>
      <ModalBg onClick={_onClose}/>
      <HeaderOverModal>{headerOverModal}</HeaderOverModal>
      <ModalCard size={size} padding={padding}>
        <ModalHeader title={title} onClose={_onClose} titleCenterPosition={titleCenterPosition}/>
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
  flex-direction: column;
  align-items: center;
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

const ModalCard = styled(Card)<ModalCardProps>`
  overflow: hidden;
  position: relative;
  width: ${({ size }) => size === 'm' ? '500px' : '700px'};
  height: fit-content;
  color: white;
  z-index: 1;
`

const HeaderOverModal = styled.header`
  position: relative;
  margin: -36px 0 44px;
  z-index: 1;
`
