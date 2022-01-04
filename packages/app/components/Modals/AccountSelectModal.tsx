import Image from 'next/image'
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Chains, useAccounts, useActiveAccounts } from 'use-substrate'

import KusamaLogo from '../../assets/img/kusama.svg'
import StatemineLogo from '../../assets/img/statemine.svg'
import { useAccountSelect, useToggle } from '../../utils'
import { AccountSelect } from '../AccountSelect'
import { Arrow } from '../icons'
import { ButtonPrimary, ButtonTertiary, CloseButton, Loader, Modal, Text, Title } from '../index'
import { SectionTitle } from '../SectionTitle/SectionTitle'

interface Props {
  closeModal: () => void
  isOpen: boolean,
}

export function AccountSelectModal({ closeModal, isOpen }: Props): JSX.Element {
  const accounts = useAccounts()
  const { setActiveAccounts } = useActiveAccounts()
  const [isKusamaAccountSelectVisible, toggleKusamaAccountSelectVisible, setKusamaAccountSelectVisible] = useToggle()

  const {
    account: kusamaAccount,
    setAccount: setKusamaAccount,
    accountInfo: kusamaAccountInfo,
    setAccountInfo: setKusamaAccountInfo,
    hasFreeBalance: hasKusamaFreeBalance,
    clearData: clearKusamaData
  } = useAccountSelect(accounts, Chains.Kusama)

  const {
    account: statemineAccount,
    setAccount: setStatemineAccount,
    accountInfo: statemineAccountInfo,
    setAccountInfo: setStatemineAccountInfo,
    hasFreeBalance: hasStatemineFreeBalance,
    clearData: clearStatemineData
  } = useAccountSelect(accounts, Chains.Statemine)

  useEffect(() => {
    setStatemineAccountInfo(undefined)
    setKusamaAccountInfo(undefined)

    if (!hasStatemineFreeBalance && !isKusamaAccountSelectVisible) {
      setStatemineAccountInfo('This account has insufficient funds, consider adding Kusama account.')

      return
    }

    if (isKusamaAccountSelectVisible) {
      setStatemineAccountInfo('Funds will be transferred to this Statemine account from your Kusama account.')
    }

    if (isKusamaAccountSelectVisible && !hasKusamaFreeBalance) {
      setKusamaAccountInfo('This account has no funds')
    }
  }, [hasStatemineFreeBalance, isKusamaAccountSelectVisible, hasKusamaFreeBalance, setStatemineAccountInfo, setKusamaAccountInfo])

  const _onClick = async (): Promise<void> => {
    setActiveAccounts({
      [Chains.Kusama]: kusamaAccount,
      [Chains.Statemine]: statemineAccount
    })
    closeModal()
  }

  const _onClose = (): void => {
    clearKusamaData()
    clearStatemineData()
    setKusamaAccountSelectVisible(false)
    closeModal()
  }

  const _onKusamaSelectHide = (): void => {
    setKusamaAccount(undefined)
    setKusamaAccountSelectVisible(false)
  }

  const hideKusamaSelectButton = <StyledCloseButton data-testid='close-account-select' onClick={_onKusamaSelectHide}/>

  if (accounts.extensionStatus === 'Loading') return <Loader />

  return (
    <Modal
      title='Connect accounts'
      padding='m'
      isOpen={isOpen}
      onClose={_onClose}
    >
      <TextStyle size='SM'>
        Asset creation and transfers happen on the <b>Statemine</b> parachain. You <b>need an account with a balance on Statemine</b> for fees and deposits. However, you can also use a fresh & empty account, and send funds from your Kusama account.
      </TextStyle>
      <SectionTitleStyle>
        <ImageWrapper>
          <Image src={StatemineLogo} alt='Statemine' />
        </ImageWrapper>
        <Title color='white'>Statemine account</Title>
      </SectionTitleStyle>
      <AccountSelect
        label='Choose account'
        accounts={accounts.allAccounts}
        currentAccount={statemineAccount}
        setCurrentAccount={setStatemineAccount}
        tip={statemineAccountInfo}
        chain={Chains.Statemine}
      />
      {!isKusamaAccountSelectVisible && (
        <Centered>
          <ButtonTertiary onClick={toggleKusamaAccountSelectVisible}>Add Kusama account</ButtonTertiary>
        </Centered>
      )}
      {(isKusamaAccountSelectVisible || !!kusamaAccount) && (
        <>
          <SectionTitleStyle>
            <ImageWrapper>
              <Image src={KusamaLogo} alt='Kusama' />
            </ImageWrapper>
            <Title color='white'>Kusama account</Title>
          </SectionTitleStyle>
          <AccountSelect
            label='Choose account'
            accounts={accounts.allAccounts}
            currentAccount={kusamaAccount}
            setCurrentAccount={setKusamaAccount}
            tip={kusamaAccountInfo}
            button={hideKusamaSelectButton}
            chain={Chains.Kusama}
          />
        </>
      )}
      <StyledButtonPrimary onClick={_onClick}>
        Connect
        <Arrow direction='right' width='14' height='9' />
      </StyledButtonPrimary>
      {accounts.error === 'EXTENSION' && <div>No extension available</div>}
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

const StyledCloseButton = styled(CloseButton)`
  margin-left: auto;
`

const ImageWrapper = styled.div`
  width: 32px;
  height: 32px;
`

const Centered = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 32px 0 8px;
`
