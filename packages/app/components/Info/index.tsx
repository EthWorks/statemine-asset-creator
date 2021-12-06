import type { FC } from 'react'

import styled from 'styled-components'

import { InfoIcon } from '../icons/InfoIcon'
import { Text } from '../typography'

export interface InfoProps {
  type: 'info' | 'warning',
}

export const Info: FC<InfoProps> = ({ children, type }) => (
  <InfoWrapper type={type} data-testid='infobox'>
    <div>
      <InfoIcon />
      <Text size='SM'>{type}</Text>
    </div>
    <Text size='SM' color='white'>{children}</Text>
  </InfoWrapper>
)

const InfoWrapper = styled.div<Pick<InfoProps, 'type'>>`
  overflow: hidden;
  position: relative;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ type }) => type === 'warning' ? ({ theme }) => theme.colors.red : ({ theme }) => theme.colors.blue};
    opacity: ${({ type }) => type === 'warning' ? '.3' : '.4'};
    z-index: -1;
  }
  
  & > div {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    p {
      text-transform: capitalize;
      color: ${({ type }) => type === 'warning' ? ({ theme }) => theme.colors.redDark : ({ theme }) => theme.colors.indigo};
    }

    svg {
      stroke: ${({ type }) => type === 'warning' ? ({ theme }) => theme.colors.redDark : ({ theme }) => theme.colors.indigo};
      margin-right: 11px;
    }
  }
`
