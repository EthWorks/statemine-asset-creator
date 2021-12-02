import React, { FC } from 'react'
import styled from 'styled-components'

import { TextInput } from '../FormElements'
import { Arrow } from '../icons'

interface Props {
  onChange: (value: (((prevState: string) => string) | string)) => void,
  value: string,
  isOpen: boolean,
  toggleOpen: () => void
}

export const AccountInput: FC<Props> = ({ onChange, value, toggleOpen, isOpen }) => {
  const _handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && isOpen) {
      toggleOpen()
    }
  }

  return (
    <AccountInputWrapper>
      <StyledTextInput
        id="open-account-select-input"
        data-testid="open-account-select-input"
        placeholder="Select account or paste account address"
        onChange={onChange}
        value={value}
        onKeyDown={_handleEnterDown}
      />
      <StyledArrow onClick={toggleOpen} direction="down" width="14" height="9"/>
    </AccountInputWrapper>
  )
}

const AccountInputWrapper = styled.div`
  position: relative;
  color:  ${({ theme }) => theme.colors.gray[400]};
`

const StyledTextInput = styled(TextInput)`
  position: relative;
  max-width: 636px;
  margin: 0;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray[800]};
  color: ${({ theme }) => theme.colors.gray[400]};

  &:focus-within {
    outline: 1px solid ${({ theme }) => theme.colors.pinkLight};
    border-color: ${({ theme }) => theme.colors.pinkLight};
    caret-color: ${({ theme }) => theme.colors.pinkLight};
  }
  
  input {
    width: 100%;
    padding: 28px 18px 12px;
    border: none;

    &:focus,
    &:focus-visible {
      outline: none;
      border: none;
    }

    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: ${({ theme }) => theme.colors.white};
      opacity: 1; /* Firefox */
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  cursor: pointer;
`
