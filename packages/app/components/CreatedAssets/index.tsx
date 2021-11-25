import 'swiper/css'
import 'swiper/css/navigation'

import { FC } from 'react'
import styled from 'styled-components'
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { UseAssets } from 'use-substrate'

import { ArrowLarge } from '../icons'
import { AssetCard } from './AssetCard'

SwiperCore.use([Navigation])

interface Props {
  assets: UseAssets
}

export const CreatedAssets: FC<Props> = ({ assets }) => {
  return (
    <div>
      <StyledSwiper
        modules={[ Navigation ]}
        data-testid='created-assets'
        spaceBetween={24}
        slidesPerView={3}
        navigation = {{
          nextEl: '.nextSlide',
          prevEl: '.prevSlide'
        }}
      >
        {assets.map(asset => <SwiperSlide key={asset.id.toString()}><AssetCard key={asset.id.toString()} asset={asset}/></SwiperSlide>)}
      </StyledSwiper>
      <SliderFooter>
        <SlideBtn className='prevSlide'>
          <ArrowLarge direction='left' width='24' height='24' />
        </SlideBtn>
        <SlideBtn className='nextSlide'>
          <ArrowLarge direction='right' width='24' height='24' />
        </SlideBtn>
      </SliderFooter>
    </div>
  )
}

const StyledSwiper = styled(Swiper)`
  align-items: stretch;
  padding: 0 11.11vw;
`

const SliderFooter = styled.footer`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`

const SlideBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.pinkLight};

  & + button {
    margin-left: 16px;
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.pinkDark};
    cursor: not-allowed;
  }
`
