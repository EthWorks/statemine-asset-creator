import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { ButtonPrimary, Card, PageBox, PageTemplate, Text } from '../components'
import { LANDING_PAGE_LINK } from '../utils'

const TermsOfService: NextPage = () => {
  const router = useRouter()
  const _onClick = async (): Promise<void> => {
    await router.push(LANDING_PAGE_LINK)
  }

  return (
    <>
      <Head>
        <title>Terms of service</title>
        <meta name="description" content="Terms of service of Statemine Asset Creator"/>
      </Head>
      <StyledPageTemplate
        title="Terms of service"
        templateHeader={<ButtonPrimary onClick={_onClick}>Back to Main Page</ButtonPrimary>}
      >
        <PageBox size='large'>
          <Card padding='m'>
            <StyledText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum bibendum est, et venenatis purus efficitur quis. Vivamus tortor massa, congue et felis nec, posuere ullamcorper sapien. Maecenas imperdiet aliquet nulla ac hendrerit. Fusce sodales vel eros cursus tincidunt. Aenean aliquet metus eu sapien mollis aliquet. Cras rhoncus quis tellus non aliquet. Aliquam nec sollicitudin magna, sit amet congue purus. Donec condimentum sed augue ut mollis. Proin mattis orci finibus arcu congue, id cursus mi viverra. Nam euismod justo non massa posuere maximus. Nunc gravida nisi a cursus laoreet. Phasellus rhoncus nisi consequat, posuere sapien quis, commodo massa.

            Aliquam erat volutpat. Maecenas varius risus vel bibendum laoreet. Nunc at sodales ligula, non convallis nisi. Sed varius, lacus ut lacinia accumsan, quam nisl pellentesque dui, non rhoncus metus tellus dignissim lacus. Pellentesque consequat lorem neque, sed sagittis sapien porta non. Maecenas vulputate accumsan purus ac aliquet. Nullam ut magna vel odio finibus ornare. Pellentesque maximus urna eu dui vestibulum cursus. Suspendisse et eros id neque volutpat bibendum. Aenean cursus nibh et arcu elementum egestas. Maecenas tincidunt eget turpis et luctus. Nullam elit nibh, feugiat quis ex ultricies, dignissim feugiat quam.

            Curabitur nulla turpis, facilisis vitae orci nec, vulputate aliquet nisl. Ut massa nulla, fermentum eget fermentum maximus, rhoncus nec enim. Fusce tempus libero nec volutpat mollis. Nulla a odio convallis, commodo enim quis, ornare lorem. Quisque pellentesque orci ac eros vulputate vulputate. Mauris sit amet est id massa auctor rutrum vitae non risus. Donec sit amet fermentum ante. Quisque elit lacus, vestibulum vel sodales id, tincidunt quis sem.
            </StyledText>
            <StyledText>
              In hac habitasse platea dictumst. Fusce odio arcu, auctor eget finibus quis, porttitor eget nisl. Morbi luctus est in tellus hendrerit placerat ut id tortor. Proin diam eros, tristique ac suscipit vel, vehicula ac risus. In varius tortor eu felis ultrices, at cursus felis commodo. Sed sed cursus velit. Nunc fermentum, velit at cursus vulputate, odio nulla semper eros, vel fermentum ipsum diam a risus. Donec leo dui, consequat et pellentesque at, posuere vitae leo. Etiam vel commodo ex, eu bibendum diam. Mauris varius nibh nec turpis egestas laoreet. Praesent metus nibh, elementum sit amet cursus at, tincidunt eu felis. Nulla facilisi. Nam varius neque ut odio pharetra sollicitudin. Duis at erat a sem efficitur facilisis sed id dolor.

              Donec eget enim risus. Aenean sagittis ac tellus et consectetur. Nam pulvinar nulla quis nisi molestie, eu accumsan sem rutrum. Proin ultricies nulla eu gravida maximus. Donec maximus porttitor eleifend. Aenean rhoncus sodales faucibus. Nam consequat consequat libero, nec cursus sem posuere quis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam varius magna non magna aliquet, sed fringilla libero bibendum.
            </StyledText>
          </Card>
        </PageBox>
      </StyledPageTemplate>
    </>
  )
}

export default TermsOfService

const StyledPageTemplate = styled(PageTemplate)`
  margin-top: 48px;
`

const StyledText = styled(Text)`
  margin: 12px 0;
`
