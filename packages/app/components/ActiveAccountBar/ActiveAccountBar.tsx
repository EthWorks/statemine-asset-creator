import type { FC } from 'react'

import styled from 'styled-components'

import kusamaLogo from '../../assets/img/kusama.svg'
import statemineLogo from '../../assets/img/statemine.svg'
import { useAppChains } from '../../utils'
import { ButtonSquare } from '../button/Button'
import { Edit } from '../icons'
import { ActiveAccount } from './ActiveAccount'

interface Props {
  onClick: () => void
}

export const ActiveAccountBar: FC<Props> = ({ onClick }) => {
  const { relayChain, parachain } = useAppChains()

  return (
    <ActiveAccountWrapper data-testid="active-account-bar">
      <ActiveAccount
        key={relayChain}
        chain={relayChain}
        logo={kusamaLogo}
      />
      <ActiveAccount
        key={parachain}
        chain={parachain}
        logo={statemineLogo}
      />
      <EditButton onClick={onClick}>
        <Edit />
      </EditButton>
    </ActiveAccountWrapper>
  )
}

const ActiveAccountWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 8px;
  align-items: center;
  padding: 4px 8px 4px 4px;
  border-radius: ${({ theme }) => theme.borderRadius.l};
  background-color: ${({ theme }) => theme.colors.black};
`

const EditButton = styled(ButtonSquare)`
  color: ${({ theme }) => theme.colors.gray[500]};
  
  &:hover {
    background: none;
  }
`
