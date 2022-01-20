import Image from 'next/image'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import arrow from '../../assets/arrow-right.svg'
import { ChainLogo } from '../ChainLogo'
import { Text } from '../typography'

export interface ChainIdentifierProps {
  chainMain: Chains,
  chainTo?: Chains
}

export const ChainIdentifier = ({ chainMain, chainTo }: ChainIdentifierProps): JSX.Element => (
  <IdentifierWrapper>
    <IdentifierItem>
      <ChainLogo chain={chainMain}/>
      <StyledText color='white' bold size='XS'>{chainMain}</StyledText>
    </IdentifierItem>
    {chainTo && (
      <>
        <ArrowWrapper>
          <Image width='20' height='20' src={arrow} alt='' />
        </ArrowWrapper>
        <IdentifierItem>
          <ChainLogo chain={chainTo}/>
          <StyledText color='white' bold size='XS'>{chainTo}</StyledText>
        </IdentifierItem>
      </>
    )}
  </IdentifierWrapper>
)

const IdentifierWrapper = styled.div`
  display: flex;
  align-items: center;
`

const IdentifierItem = styled.div`
  display: flex;
  align-items: center;
`

const ArrowWrapper = styled.div`
  margin: 0 10px;
`

const StyledText = styled(Text)`
  text-transform: capitalize;
  margin-left: 8px;
`
