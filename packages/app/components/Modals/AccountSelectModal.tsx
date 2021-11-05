import type { Account } from 'use-substrate'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAccounts } from 'use-substrate'

import StatemineLogo from '../../assets/img/statemine.png'
import { AccountSelect } from '../AccountSelect'
import { Arrow } from '../icons/Arrow'
import { Title } from '../index'
import { ButtonPrimary, Modal, Text } from '../index'
import { SectionTitle } from '../SectionTitle/SectionTitle'

interface Props {
  closeModal: () => void
  isOpen: boolean,
}

export function AccountSelectModal({ closeModal, isOpen }: Props): JSX.Element {
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])

  const _onClick = async (): Promise<void> => {
    localStorage.setItem('activeAccount', account.address)
    closeModal()
  }

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  if (!accounts.allAccounts.length || !account) return <>Loading..</>

  return (
    <Modal
      title='Connect accounts'
      padding='m'
      isOpen={isOpen}
      onClose={closeModal}
    >
      <TextStyle size='SM'>
        Asset creation and transfers happen on the <b>Statemine</b> parachain. You <b>need an account with a balance on Statemine</b> for fees and deposits. However, you can also use a fresh & empty account, and send funds from your Kusama account.
      </TextStyle>
      <SectionTitleStyle>
        <Image src={StatemineLogo} alt='Statemine' />
        <Title>Statemine account</Title>
      </SectionTitleStyle>
      <AccountSelect
        label='Choose account'
        accounts={accounts.allAccounts}
        currentAccount={account}
        setCurrentAccount={setAccount}
      />
      <StyledButtonPrimary disabled onClick={_onClick}>
        Connect
        <Arrow direction='right' width='14' height='9' />
      </StyledButtonPrimary>
      { accounts.error === 'EXTENSION' && <div>No extension available</div>}
    </Modal>
  )
}

const TextStyle = styled(Text)`
  b {
    color: ${({ theme }) => theme.colors.white};
  }
`

const SectionTitleStyle = styled(SectionTitle)`
  margin: 24px 0;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  margin: 24px 0 0 auto;
`
