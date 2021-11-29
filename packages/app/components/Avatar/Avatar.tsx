import Identicon from '@polkadot/react-identicon'

export interface AvatarProps {
  address: string,
  size?: 's' | 'm',
}

const Avatar = ({ size, address }: AvatarProps): JSX.Element => (
  <Identicon
    size={size === 's' ? 25 : 40}
    value={address}
    theme='beachball'
  />
)

export default Avatar
