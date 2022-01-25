import type { NextPage } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import error404 from '../assets/404.svg'
import errorX from '../assets/error.svg'
import { ButtonTertiary, PageTemplate, Text } from '../components'

interface ErrorPageProps {
  statusCode: number | undefined,
  text?: string
}

const Error: NextPage<ErrorPageProps> = ({ statusCode, text }) => {
  return (
    <PageTemplate errorPage>
      {statusCode === 404
        ? <Image src={error404} alt='Page not found' />
        : <Image src={errorX} alt='Internal server error' />
      }
      <StyledText size='2XL' color='white' bold>Ooops...Something went wrong</StyledText>
      {text && <InfoText size='SM'>{text}</InfoText>}
      {statusCode === 404
        ? <Link href='/' passHref><ButtonTertiary>Back to dashboard</ButtonTertiary></Link>
        : <Text size='SM' bold>Try again later</Text>
      }
    </PageTemplate>
  )
}

Error.getInitialProps = ({ res, err }): ErrorPageProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return { statusCode }
}

export default Error

const StyledText = styled(Text)`
  margin: 62px 0 24px;
  text-align: center;
`

const InfoText = styled(Text)`
  margin-bottom: 24px;
  max-width: 400px;
  text-align: center;
`
