import styled from 'styled-components'

interface ColorRingProps {
  color: string
}

export const AssetImage = styled.div<ColorRingProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  min-width: 64px;
  height: 64px;
  margin-right: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: 1px solid ${({ color }) => color};
  
  &:hover {
    & > div {
      display: block;
    }
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    border: 1px solid ${({ color }) => color};
  }
`
