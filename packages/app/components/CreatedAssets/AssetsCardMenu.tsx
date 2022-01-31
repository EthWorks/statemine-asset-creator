import type { AssetId } from '@polkadot/types/interfaces'

import styled, { css } from 'styled-components'

import { useStatescanLink } from '../../utils'
import { ViewIcon } from '../icons'

interface AssetsCardMenuProps {
  assetId: AssetId,
  isOpen: boolean
}

export const AssetsCardMenu = ({ assetId, isOpen }:AssetsCardMenuProps):JSX.Element => {
  const statescanLink = useStatescanLink()

  return (
    <CardMenuWrapper isOpen={isOpen}>
      <CardMenu>
        <li>
          <MenuLink href={statescanLink + assetId.toString()} target="_blank" rel="noopener noreferrer">
            <ViewIcon width='20' height='20' />
          View in explorer
          </MenuLink>
        </li>
      </CardMenu>
    </CardMenuWrapper>
  )
}

const CardMenuWrapper = styled.div<Omit<AssetsCardMenuProps, 'assetId'>>`
  overflow: hidden;
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  
  ${({ isOpen }) => isOpen && css`
    display: block;
  `}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.gray700};
    opacity: 0.9;
    backdrop-filter: blur(1.5px);
  }
`

const CardMenu = styled.ul`
  position: relative;
  padding: 8px;
  margin: 0;
  background: none;
  z-index: 1;
  
  li {
    padding: 4px;
    
    & + li {
      margin-top: 12px;
    }
  }
`

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.gray400};
  transition: .25s ease-in;
  
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.white};
    margin-right: 4px;
  }
`
