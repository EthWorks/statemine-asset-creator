import Image from 'next/image'
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useAccounts, useActiveAccounts } from 'use-substrate'

import KusamaLogo from '../../assets/img/kusama.svg'
import StatemineLogo from '../../assets/img/statemine.svg'
import { useAccountSelect, useAppChains, useCapitalizedChains, useToggle } from '../../utils'
import { AccountSelect } from '../AccountSelect'
import { Arrow } from '../icons'
import { ButtonPrimary, ButtonTertiary, CloseButton, Loader, Modal, Text, Title } from '../index'
import { SectionTitle } from '../SectionTitle/SectionTitle'

interface Props {
  closeModal: () => void
  isOpen: boolean,
}

export function AccountSelectModal({ closeModal, isOpen }: Props): JSX.Element {
  const { relayChain, parachain } = useAppChains()
  const accounts = useAccounts()
  const { setActiveAccounts } = useActiveAccounts()
  const [isRelayChainAccountSelectVisible, toggleRelayChainAccountSelectVisible, setRelayChainAccountSelectVisible] = useToggle()
  const [capitalizedRelayChain, capitalizedParachain] = useCapitalizedChains([relayChain, parachain])

  const {
    account: relayChainAccount,
    setAccount: setRelayChainAccount,
    accountInfo: relayChainAccountInfo,
    setAccountInfo: setRelayChainAccountInfo,
    hasFreeBalance: hasRelayChainFreeBalance,
    clearData: clearRelayChainData
  } = useAccountSelect(relayChain)

  const {
    account: parachainAccount,
    setAccount: setParachainAccount,
    accountInfo: parachainAccountInfo,
    setAccountInfo: setParachainAccountInfo,
    hasFreeBalance: hasParaChainFreeBalance,
    clearData: clearParaChainData
  } = useAccountSelect(parachain)

  useEffect(() => {
    setParachainAccountInfo(undefined)
    setRelayChainAccountInfo(undefined)

    if (!hasParaChainFreeBalance && !isRelayChainAccountSelectVisible) {
      setParachainAccountInfo(`This account has insufficient funds, consider adding a ${capitalizedRelayChain} account.`)

      return
    }

    if (isRelayChainAccountSelectVisible) {
      setParachainAccountInfo(`Funds will be transferred to this ${capitalizedParachain} account from your Kusama account.`)
    }

    if (isRelayChainAccountSelectVisible && !hasRelayChainFreeBalance) {
      setRelayChainAccountInfo('This account has no funds')
    }
  }, [hasParaChainFreeBalance, isRelayChainAccountSelectVisible, hasRelayChainFreeBalance, setParachainAccountInfo, setRelayChainAccountInfo, capitalizedRelayChain, capitalizedParachain])

  const _onClick = async (): Promise<void> => {
    setActiveAccounts({
      [relayChain]: relayChainAccount,
      [parachain]: parachainAccount
    })
    closeModal()
  }

  const _onClose = (): void => {
    clearRelayChainData()
    clearParaChainData()
    setRelayChainAccountSelectVisible(false)
    closeModal()
  }

  const _onRelayChainSelectHide = (): void => {
    setRelayChainAccount(undefined)
    setRelayChainAccountSelectVisible(false)
  }

  const hideKusamaSelectButton = <StyledCloseButton data-testid='close-account-select' onClick={_onRelayChainSelectHide}/>

  if (accounts.extensionStatus === 'Loading') return <Loader />

  const displayKusamaSelect = isRelayChainAccountSelectVisible || !!relayChainAccount

  return (
    <Modal
      title='Connect accounts'
      padding='m'
      isOpen={isOpen}
      onClose={_onClose}
    >
      <TextStyle size='SM'>
        Asset creation and transfers happen on the <b>{capitalizedParachain}</b> parachain. You <b>need an account with a balance on {capitalizedParachain}</b> for fees and deposits. However, you can also use a fresh & empty account, and send funds from your {capitalizedRelayChain} account.
      </TextStyle>
      <SectionTitleStyle>
        <ImageWrapper>
          <Image src={StatemineLogo} alt='Statemine' />
        </ImageWrapper>
        <Title color='white'>{capitalizedParachain} account</Title>
      </SectionTitleStyle>
      <AccountSelect
        label='Choose account'
        accounts={accounts.allAccounts}
        currentAccount={parachainAccount}
        setCurrentAccount={setParachainAccount}
        tip={parachainAccountInfo}
        chain={parachain}
      />
      {!displayKusamaSelect && (
        <Centered>
          <ButtonTertiary onClick={toggleRelayChainAccountSelectVisible}>Add {capitalizedRelayChain} account</ButtonTertiary>
        </Centered>
      )}
      {displayKusamaSelect && (
        <>
          <SectionTitleStyle>
            <ImageWrapper>
              <Image src={KusamaLogo} alt='Kusama' />
            </ImageWrapper>
            <Title color='white'>{capitalizedRelayChain} account</Title>
          </SectionTitleStyle>
          <AccountSelect
            label='Choose account'
            accounts={accounts.allAccounts}
            currentAccount={relayChainAccount}
            setCurrentAccount={setRelayChainAccount}
            tip={relayChainAccountInfo}
            button={hideKusamaSelectButton}
            chain={relayChain}
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
