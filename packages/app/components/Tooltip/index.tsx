import * as Tooltip from '@radix-ui/react-tooltip'
import styled from 'styled-components'

import { TooltipIcon } from '../icons/TooltipIcon'
import { Text } from '../typography'

export interface TooltipBoxProps {
  text: string
}

export const TooltipBox = ({ text }: TooltipBoxProps): JSX.Element => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <TooltipBtn>
        <TooltipIcon />
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
  color: ${({ theme }) => theme.colors.gray[400]};
  padding: 0;
  margin: 0;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: none;
  cursor: pointer;
`

const Dropdown = styled(Tooltip.Content)`
  padding: 8px;
  max-width: 224px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[500]};
`

const DropdownArrow = styled(Tooltip.Arrow)`
  fill: ${({ theme }) => theme.colors.gray[500]};
`
