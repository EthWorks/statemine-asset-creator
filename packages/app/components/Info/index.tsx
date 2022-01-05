import type { FC } from 'react'

import styled from 'styled-components'

import { ButtonTertiary } from '../button/Button'
import { InfoIcon } from '../icons'
import { Text } from '../typography'

export interface InfoProps {
  type?: 'info' | 'warning',
  text: string,
  className?: string,
  action?: {
    name: string,
    onClick: () => void
  }
}

export const Info: FC<InfoProps> = ({ text, type = 'info', className, action }) => (
  <InfoWrapper className={className} type={type} data-testid={`infobox-${type}`}>
    <div>
      <InfoIcon />
      <Text size='SM'>{type}</Text>
    </div>
    <Text size='SM' color='white'>{text}</Text>
    {action && (
      <ButtonTertiary onClick={action.onClick}>
        {action.name}
      </ButtonTertiary>
    )}
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
  
  button {
    margin: 8px auto 0;
  }
`
