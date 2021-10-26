import Image from 'next/image'
import styled from 'styled-components'

export interface AvatarProps {
  size?: 's' | 'm',
}

const Avatar = styled(Image).attrs<AvatarProps>(props => ({
  height: props.size === 's' ? '25px' : '40px',
  width: props.size === 's' ? '25px' : '40px'
}))<AvatarProps>`
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  object-fit: cover;
`

export default Avatar
