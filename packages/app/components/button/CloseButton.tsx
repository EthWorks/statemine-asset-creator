import styled from 'styled-components'

export const CloseButton = styled.button`
  position: relative;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.gray[600]};
  }
  
  &:before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &:after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`
