import type { FC } from 'react'

import dynamic from 'next/dynamic'

export interface AvatarProps {
  size?: 's' | 'm',
  address: string
}

const THEME = 'polkadot'

const Identicon = dynamic(
  () => import('@polkadot/react-identicon'),
  { ssr: false }
)

export const Avatar: FC<AvatarProps> = ({ address, size }) => {
  return (
    <Identicon
      value={address}
      size={size === 's' ? 24 : 40}
      theme={THEME}
    />
  )
}
