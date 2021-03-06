import { ReactNode } from 'react'
import styled from 'styled-components'

import { Text } from '../typography'

export interface PageBoxProps {
  children: ReactNode,
  size: 'large' | 'full',
  title?: ReactNode
}

export const PageBox = ({ children, size, title }: PageBoxProps): JSX.Element => (
  <PageBoxWrapper>
    <StyledText size="SM" color="white">{title}</StyledText>
    <PageBoxContent size={size}>
      {children}
    </PageBoxContent>
  </PageBoxWrapper>
)

const PageBoxWrapper = styled.div`
  margin-bottom: 36px;
`

const PageBoxContent = styled.div<Pick<PageBoxProps, 'size'>>`
  margin-top: 16px;
  padding: ${({ size }) => size === 'large' ? '0 11.11vw' : '0'};
`

const StyledText = styled(Text)`
  margin-left: 11.11vw;
  line-height: 18px;
`
