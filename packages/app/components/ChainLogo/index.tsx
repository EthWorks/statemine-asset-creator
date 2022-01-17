import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

import { Chains } from 'use-substrate'

import { chainLogoPicker } from '../../formatters'

interface ChainLogoProps {
  chain: Chains,
  className?: string
}

function ChainLogoComponent({ chain, className }: ChainLogoProps): JSX.Element {
  return (
    <ImageWrapper className={className} data-testid={`${chain}-chain-logo`}>
      <Image src={chainLogoPicker(chain)} alt=''/>
    </ImageWrapper>
  )
}

export const ChainLogo = React.memo(ChainLogoComponent)

const ImageWrapper = styled.div`
  width: 25px;
  height: 25px;
`
