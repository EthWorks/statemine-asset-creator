import Image from 'next/image'
import styled from 'styled-components'

import arrow from '../../assets/arrow-right.svg'
import { chainLogoPicker } from '../../formaters/chainLogoPicker'
import { ChainName } from '../../globalTypes'
import { Text } from '../typography'

export interface ChainIdentifierProps {
  chainFrom: ChainName,
  chainTo?: ChainName
}

export const ChainIdentifier = ({ chainFrom, chainTo }: ChainIdentifierProps): JSX.Element => (
  <IdentifierWrapper>
    <IdentifierItem>
      <ImageWrapper>
        <Image width='25' height='25' src={chainLogoPicker(chainFrom)} alt={chainFrom} />
      </ImageWrapper>
      <Text color='white' bold size='XS'>{chainFrom}</Text>
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
          <Text color='white' bold size='XS'>{chainTo}</Text>
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
