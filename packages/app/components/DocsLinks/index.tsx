import styled from 'styled-components'

import { Card, Link, PageBox, Text } from '../index'

const ASSETS_LINK = 'https://wiki.polkadot.network/docs/learn-assets'
const TELEPORT_LINK = 'https://wiki.polkadot.network/docs/learn-teleport'

interface Props {
  withPadding?: boolean
}

export function DocsLinks({ withPadding = false }: Props): JSX.Element {
  return (
    <PageBox size={withPadding ? 'large' : 'full'}>
      <StyledCard color="gray700" padding="m">
        <Header color='white'>Learn more about assets</Header>
        <StyledText color='white'>
          Are you curious how to create your own asset? You don&apos;t know how to make a teleport? Read our guide and start!
        </StyledText>
        <StyledLink href={ASSETS_LINK} target="_blank" rel="noopener noreferrer">Read more about assets</StyledLink>
        <StyledLink href={TELEPORT_LINK} target="_blank" rel="noopener noreferrer">How to Teleport</StyledLink>
      </StyledCard>
    </PageBox>
  )
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Header = styled(Text)`
  font-weight: bold;
  font-size: 18px;
  line-height: 32px;
  margin: 0 4px;
`

const StyledText = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  max-width: 449px;
  margin: 0 4px;
`

const StyledLink = styled(Link)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin: 0 4px;
`
