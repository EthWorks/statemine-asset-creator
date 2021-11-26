import styled from 'styled-components'

import { Step } from './Step'

const NAVIGATION_STEPS = ['General info', 'Accounts', 'Mint', 'Summary']

export interface StepsBarProps {
  optional?: boolean,
  activeStep: number
}

export const StepsBar = ({ optional, activeStep }: StepsBarProps ): JSX.Element => (
  <StyledStepBar>
    {NAVIGATION_STEPS.map((step, index) => (
      <Step
        key={index}
        index={index}
        stepName={step}
        activeStep={activeStep}
        optional={optional}
      />
    ))}
  </StyledStepBar>
)

const StyledStepBar = styled.div`
  display: flex;
  justify-content: center;
  padding: 21px 44px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: ${({ theme }) => theme.borderRadius.m};
`
