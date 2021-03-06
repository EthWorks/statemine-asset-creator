import Image from 'next/image'
import styled from 'styled-components'

import loaderIcon from '../../assets/loader.svg'

export interface LoaderProps {
  fullPage?: boolean
}

export const Loader = ({ fullPage }: LoaderProps): JSX.Element => (
  <LoaderWrapper fullPage={fullPage} data-testid='loader'>
    <LoaderBg />
    <Image src={loaderIcon} alt='' width='200' height='200' />
  </LoaderWrapper>
)

const LoaderWrapper = styled.div<LoaderProps>`
  position: ${({ fullPage }) => fullPage ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1.5px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoaderBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray800};
  opacity: .6;
`
