import Image from 'next/image'
import { ReactNode } from 'react'
import styled from 'styled-components'

import { Text } from '../typography'

export interface PageTemplateProps {
  background: string,
  children: ReactNode,
  header?: ReactNode,
  title?: string,
  templateHeader: ReactNode
}

export const PageTemplate = ({ background, children, header, title, templateHeader }: PageTemplateProps): JSX.Element => (
  <>
    <PageWrapper>
      <PageBg>
        <Image src={background} alt='' />
      </PageBg>
      {header && <MainHeader>{header}</MainHeader>}
      <PgeTitleWrapper>
        <Text size='2XL' color='white' bold>{title}</Text>
        {templateHeader}
      </PgeTitleWrapper>
      {children}
    </PageWrapper>
  </>
)

export const PageWrapper = styled.main`
  position: relative;
  min-height: 100vh;
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

export const PgeTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 11.11vw;
  margin-bottom: 24px;
`

const MainHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  min-height: 80px;
  width: 100%;
  margin-bottom: 34px;
  padding: 18px 11.11vw 0 11.11vw;
`
