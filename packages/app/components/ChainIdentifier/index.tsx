import Image from 'next/image'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import arrow from '../../assets/arrow-right.svg'
import { chainLogoPicker } from '../../formaters/chainLogoPicker'
import { Text } from '../typography'

export interface ChainIdentifierProps {
  chainMain: Chains,
  chainTo?: Chains
}

export const ChainIdentifier = ({ chainMain, chainTo }: ChainIdentifierProps): JSX.Element => (
  <IdentifierWrapper>
    <IdentifierItem>
      <ImageWrapper>
        <Image width='25' height='25' src={chainLogoPicker(chainMain)} alt={chainMain} />
      </ImageWrapper>
      <StyledText color='white' bold size='XS'>{chainMain}</StyledText>
    </IdentifierItem>
    {chainTo && (
      <>
        <ArrowWrapper>
          <Image width='20' height='20' src={arrow} alt='' />
        </ArrowWrapper>
        <IdentifierItem>
          <ImageWrapper>
            <Image width='25' height='25' src={chainLogoPicker(chainTo)} alt={chainTo} />
          </ImageWrapper>
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

const ImageWrapper = styled.div`
  margin-right: 8px;
`

const ArrowWrapper = styled.div`
  margin: 0 10px;
`

const StyledText = styled(Text)`
  text-transform: capitalize;
`
