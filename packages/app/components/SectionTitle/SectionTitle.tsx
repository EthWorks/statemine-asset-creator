import type { ReactNode } from 'react'

import styled from 'styled-components'

export interface SectionTitleProps {
  children: ReactNode,
  className?: string,
}

export const SectionTitle = ({ children, className }: SectionTitleProps): JSX.Element => (
  <SectionTitleWrapper className={className}>
    <SectionTitleContent>
      {children}
    </SectionTitleContent>
  </SectionTitleWrapper>
)

export const SectionTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray[500]};
  }
`

const SectionTitleContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: ${({ theme }) => theme.colors.black};
  z-index: 1;

  img {
    margin-right: 8px;
  }
`
