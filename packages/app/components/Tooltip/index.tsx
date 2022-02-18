import * as Tooltip from '@radix-ui/react-tooltip'
import styled from 'styled-components'

import { TooltipIcon } from '../icons/TooltipIcon'
import { Text } from '../typography'

export interface TooltipBoxProps {
  text: string,
  className?: string
}

export const TooltipBox = ({ className, text }: TooltipBoxProps): JSX.Element => (
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={200}>
      <TooltipBtn className={className} asChild>
        <div>
          <TooltipIcon />
        </div>
      </TooltipBtn>
      <Dropdown>
        <Text size='XXS' color='white'>{text}</Text>
        <DropdownArrow />
      </Dropdown>
    </Tooltip.Root>
  </Tooltip.Provider>
)

const TooltipBtn = styled(Tooltip.Trigger)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.gray400};
  padding: 0;
  margin: 0;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: none;
  cursor: help;
`

const Dropdown = styled(Tooltip.Content)`
  padding: 8px;
  max-width: 224px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray500};
`

const DropdownArrow = styled(Tooltip.Arrow)`
  fill: ${({ theme }) => theme.colors.gray500};
`
