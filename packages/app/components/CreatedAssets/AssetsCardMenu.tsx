import styled, { css } from 'styled-components'

import { SettingsIcon, TransferIcon, ViewIcon } from '../icons'

interface AssetsCardMenuProps {
  isOpen: boolean
}

export const AssetsCardMenu = ({ isOpen }:AssetsCardMenuProps):JSX.Element => (
  <CardMenuWrapper isOpen={isOpen}>
    <CardMenu>
      <li>
        <MenuLink href="">
          <TransferIcon width='20' height='20' />
          Transfer assets
        </MenuLink>
      </li>
      <li>
        <MenuLink href="">
          <ViewIcon width='20' height='20' />
          View in explorer
        </MenuLink>
      </li>
      <li>
        <MenuLink href="">
          <SettingsIcon width='20' height='20' />
          Manage
        </MenuLink>
      </li>
    </CardMenu>
  </CardMenuWrapper>
)

const CardMenuWrapper = styled.div<AssetsCardMenuProps>`
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
    background-color: ${({ theme }) => theme.colors.gray[700]};
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
    
    &:last-child {
      padding-top: 12px;
      border-top: 1px solid ${({ theme }) => theme.colors.gray[600]};
    }
  }
`

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.gray[400]};
  transition: .25s ease-in;
  
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.white};
    margin-right: 4px;
  }
`
