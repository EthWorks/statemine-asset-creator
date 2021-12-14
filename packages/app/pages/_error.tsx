import Image from 'next/image'
import styled from 'styled-components'

import error404 from '../assets/404.svg'
import background from '../assets/background.svg'
import errorX from '../assets/error.svg'
import { ButtonTertiary, PageTemplate, Text } from '../components'

interface errorPageProps {
  statusCode: number,
  text: string,
  title?: string
}

const errorPage = ({ statusCode, text, title = 'Ooops...Something went wrong' }: errorPageProps): JSX.Element => {
  return (
    <>
      <PageTemplate background={background} errorPage>
        {statusCode === 404
          ? <Image src={error404} alt={`${statusCode}`} />
          : <Image src={errorX} alt={`${statusCode}`} />
        }
        <StyledText size='2XL' color='white' bold>{title}</StyledText>
        <InfoText size='SM'>{text}</InfoText>
        {statusCode === 404
          ? <ButtonTertiary>Back to dashboard</ButtonTertiary>
          : <Text size='SM' bold>Try again later</Text>
        }
      </PageTemplate>
    </>
  )
}

export default errorPage

const StyledText = styled(Text)`
  margin: 62px 0 24px;
  text-align: center;
`

const InfoText = styled(Text)`
  margin-bottom: 24px;
  max-width: 400px;
  text-align: center;
`
