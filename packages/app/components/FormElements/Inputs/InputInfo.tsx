import React from 'react'
import styled from 'styled-components'

import { AlertIcon } from '../../icons'
import { Text } from '../../typography'

export interface InputInfoProps {
  error?: string,
  hint?: string,
  tip?: string
}

export const InputInfo = ({ error, hint, tip }: InputInfoProps): JSX.Element => (
  <InputHintWrapper>
    {error && (
      <Error data-testid='input-error'>
        <AlertIcon width='12px' height='11px' />
        <Text size="XXS" color="red">{error}</Text>
      </Error>
    )}
    {hint && <HintText size="XXS" color='white'>{hint}</HintText>}
    {tip && <TipText size='XXS' color='indigo'>{tip}</TipText>}
  </InputHintWrapper>
)

export const InputHintWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
`

const Error = styled.div`
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

const TipText = styled(Text)`
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.indigo};
`
