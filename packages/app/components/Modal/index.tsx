import type { PaddingSize } from '../../globalTypes'

import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Card } from '../Card'
import { ModalHeader } from './ModalHeader'

export type ModalSize = 'm' | 'l'

export interface ModalProps {
  children: ReactNode,
  className?: string,
  headerOverModal?: ReactNode,
  padding?: PaddingSize,
  size?: ModalSize,
  title?: string,
  titleCenterPosition?: boolean,
  isOpen: boolean,
  onClose: () => void
}

interface ModalCardProps {
  size?: ModalSize,
}

export const Modal = ({ children, className, padding, size, title, titleCenterPosition, headerOverModal, isOpen, onClose }: ModalProps): React.ReactElement<ModalProps> | null => {
  const _onClose = (): void => onClose()

  if (!isOpen) return null

  return (
    <ModalView data-testid='modal'>
      <ModalBg onClick={_onClose}/>
      <HeaderOverModal>{headerOverModal}</HeaderOverModal>
      <ModalCard className={className} size={size} padding={padding}>
        <ModalHeader title={title} onClose={_onClose} titleCenterPosition={titleCenterPosition}/>
        {children}
      </ModalCard>
    </ModalView>
  )
}

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
  backdrop-filter: blur(1.5px);
`

const ModalBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  opacity: .6;
`

const ModalCard = styled(Card)<ModalCardProps>`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
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
