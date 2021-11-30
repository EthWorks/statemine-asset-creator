import type { FC } from 'react'

import styled from 'styled-components'

import { Chains } from 'use-substrate'

import kusamaLogo from '../../assets/img/kusama.png'
import statemineLogo from '../../assets/img/statemine.svg'
import { ButtonSquare } from '../button/Button'
import { Edit } from '../icons'
import { ActiveAccount } from './ActiveAccount'

interface Props {
  onClick: () => void
}

export const ActiveAccountBar: FC<Props> = ({ onClick }) => (
  <ActiveAccountWrapper data-testid="active-account-bar">
    <ActiveAccount
      key={Chains.Kusama}
      chain={Chains.Kusama}
      logo={kusamaLogo}
    />
    <ActiveAccount
      key={Chains.Statemine}
      chain={Chains.Statemine}
      logo={statemineLogo}
    />
    <EditButton onClick={onClick}>
      <Edit />
    </EditButton>
  </ActiveAccountWrapper>
)

const ActiveAccountWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto 24px;
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
