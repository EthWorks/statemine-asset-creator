import Image from 'next/image'
import styled from 'styled-components'

interface AvatarProps {
  size?: 's' | 'm'
}

const Avatar = styled(Image)<AvatarProps>`
  width: ${({ size }) => size === 's' ? '25px' : '40px'};
  height: ${({ size }) => size === 's' ? '25px' : '40px'};
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  object-fit: cover;
`

export default Avatar
