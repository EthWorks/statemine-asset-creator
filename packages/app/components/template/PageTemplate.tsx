import Image from 'next/image'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Loader } from '../Loader'
import { Text } from '../typography'

export interface PageTemplateProps {
  background: string,
  children: ReactNode,
  errorPage?: boolean,
  header?: ReactNode,
  title?: string,
  templateHeader?: ReactNode,
  isLoading?: boolean
}

export const PageTemplate = ({ background, children, errorPage, header, title, templateHeader, isLoading }: PageTemplateProps): JSX.Element => (
  <PageWrapper errorPage={errorPage}>
    <PageBg>
      <Image src={background} alt='' />
    </PageBg>
    {isLoading
      ? <Loader/>
      : (
        <>
          {header && <MainHeader>{header}</MainHeader>}
          {(title || templateHeader) && (
            <PageTitleWrapper>
              {title && <Text size='2XL' color='white' bold>{title}</Text>}
              {templateHeader}
            </PageTitleWrapper>
          )}
          {children}
        </>
      )}
  </PageWrapper>
)

export const PageWrapper = styled.main<Pick<PageTemplateProps, 'errorPage'>>`
  position: relative;
  min-height: 100vh;
  
  ${({ errorPage }) => errorPage && css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 11.111vw;
  `}
`

export const PageBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  
  img {
    width: 100vw!important;
    height: 100vh!important;
    object-fit: cover;
  }
`

export const PageTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 11.11vw;
  margin-bottom: 24px;
`

const MainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  min-height: 80px;
  width: 100%;
  margin-bottom: 34px;
  padding: 18px 11.11vw 0 11.11vw;
`
