import styled from 'styled-components'

import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { Card } from '../Card'
import { InfoIcon } from '../icons/InfoIcon'
import { Text } from '../typography'

export interface CookiesProps {
  text: string
}

export const Cookies = ({ text }: CookiesProps): JSX.Element => (
  <CookiesWrapper>
    <InfoIcon />
    <StyledText color='white'>{text}</StyledText>
    <ButtonOutline>Decline</ButtonOutline>
    <ButtonPrimary>Approve</ButtonPrimary>
  </CookiesWrapper>
)

const CookiesWrapper = styled(Card)`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  width: 768px;
  stroke: ${({ theme }) => theme.colors.white};
  
  button {
    padding: 4px 8px;
    width: fit-content;
    
    & + button {
      margin-left: 16px;
    }
  }
`

const StyledText = styled(Text)`
  margin: 0 16px;
  padding-right: 30px;
`
