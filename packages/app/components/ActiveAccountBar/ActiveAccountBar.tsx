import type { FC } from 'react'

import styled from 'styled-components'

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
      />
      <ActiveAccount
        key={parachain}
        chain={parachain}
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
