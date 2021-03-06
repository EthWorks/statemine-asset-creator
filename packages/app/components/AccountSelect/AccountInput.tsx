import type { FC } from 'react'

import React from 'react'
import styled from 'styled-components'

import { InputHintWrapper, TextInput } from '../FormElements'
import { Arrow } from '../icons'

interface Props {
  onChange: (value: (((prevState: string) => string) | string)) => void,
  value: string,
  isOpen: boolean,
  toggleOpen: () => void,
  error?: string
}

export const AccountInput: FC<Props> = ({ onChange, value, toggleOpen, isOpen, error }) => {
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
        error={error}
      />
      <StyledArrow onClick={toggleOpen} direction={isOpen ? 'up' : 'down'} width="14" height="9"/>
    </AccountInputWrapper>
  )
}

const AccountInputWrapper = styled.div`
  position: relative;
  color:  ${({ theme }) => theme.colors.gray400};
`

const StyledTextInput = styled(TextInput)`
  position: relative;
  max-width: 636px;
  margin: 0;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.gray400};

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
  
  ${InputHintWrapper} {
    left: 10px;
    bottom: 3px;
  }
`

const StyledArrow = styled(Arrow)`
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  cursor: pointer;
`
