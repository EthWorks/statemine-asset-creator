import styled from 'styled-components'

import { CheckIcon } from '../../icons/Check'
import { Text } from '../../typography'

interface StepProps {
  index: number,
  optional?: boolean,
  stepName: string,
  activeStep: number
}

export const Step = ({ index, optional, stepName, activeStep }: StepProps ): JSX.Element => {
  const handleClassName = ():string => (
    activeStep === index
      ? 'current'
      : activeStep > index
        ? 'past'
        : ''
  )

  return (
    <StepWrapper
      className={handleClassName()}
    >
      <StepNumber>
        {activeStep > index
          ? <CheckIcon width='14' height='14'/>
          : <Text size='XS'>{index + 1}</Text>
        }
      </StepNumber>
      <Text size='SM'>
        {stepName}
        {optional && <OptionalText size='XXS'>Optional</OptionalText>}
      </Text>
    </StepWrapper>
  )
}

const StepWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  & + & {
    margin-left: 56px;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      right: calc(100% + 8px);
      transform: translateY(-50%);
      height: 1px;
      width: 40px;
      background-color: ${({ theme }) => theme.colors.gray[600]};
    }
  }

  &.current {
    & > div {
      border-color: ${({ theme }) => theme.colors.pinkLight};
      background-color: ${({ theme }) => theme.colors.pinkLight};

      & > p {
        color: ${({ theme }) => theme.colors.white};
      }
    }

    & > p {
      color: ${({ theme }) => theme.colors.pinkLight};
    }
  }

  &.past {
    & > div {
      border-color: ${({ theme }) => theme.colors.pinkLight};
      color: ${({ theme }) => theme.colors.pinkLight};
    }
  }
`

const StepNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
`

const OptionalText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[500]};
`
