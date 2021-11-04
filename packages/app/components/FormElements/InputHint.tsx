import React from 'react'
import styled from 'styled-components'

import { AlertIcon } from '../icons/Alert'
import { Text } from '../typography'

interface InputHintProps {
  error?: string,
  hint?: string
}

export const InputHint = ({ error, hint }: InputHintProps): JSX.Element => (
  <InputHintWrapper>
    {error && (
      <HintError>
        <AlertIcon width='12px' height='11px' />
        <Text size="XXS" color="red">{error}</Text>
      </HintError>
    )}
    {hint && <HintText size="XXS" color='white'>{hint}</HintText>}
  </InputHintWrapper>
)

const InputHintWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
`

const HintError = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 10px 0 0;
  color: ${({ theme }) => theme.colors.red};
  
  svg {
    margin-right: 9px;
  }
`

const HintText = styled(Text)`
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.gray[300]};
`
