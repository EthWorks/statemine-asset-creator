import Head from 'next/head'
import Image from 'next/image'
import { ReactNode } from 'react'
import styled from 'styled-components'

import { Text } from '../typography'

export interface PageTemplateProps {
  background?: string,
  children: ReactNode,
  header?: ReactNode,
  title?: string
}

const PageTemplate = ({ background, children, header, title }: PageTemplateProps): JSX.Element => (
  <>
    <Head>
      <title>Statemine Asset Creator</title>
      <meta name="description" content="Application for managing assets on Statemine"/>
    </Head>
    <PageWrapper>
      {background &&
        <PageBg>
          <Image src={background} />
        </PageBg>
      }
      {header && <MainHeader>{header}</MainHeader>}
      <PgeTitleWrapper>
        <Text size='2XL' color='white' bold>{title}</Text>
      </PgeTitleWrapper>
      {children}
    </PageWrapper>
  </>
)

export default PageTemplate

export const PageWrapper = styled.div`
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
