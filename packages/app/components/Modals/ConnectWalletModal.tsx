import Image from 'next/image'
import styled from 'styled-components'

import { useAccounts } from 'use-substrate'

import Logo from '../../assets/img/polkadot.svg'
import { POLKADOT_EXTENSION_LINK, TOS_PAGE_LINK } from '../../utils'
import { ArrowLarge } from '../icons'
import { Link, Loader, Modal, Text } from '../index'

interface Props {
  closeModal: () => void
  isOpen: boolean,
  onExtensionActivated: () => void
}

export function ConnectWalletModal({ isOpen, closeModal, onExtensionActivated }: Props): JSX.Element {
  const { web3Enable, extensionStatus } = useAccounts()

  const _onClick = async (): Promise<void> => {
    if (extensionStatus === 'Available') {
      await web3Enable()
      localStorage.setItem('extensionActivated', 'true')
      onExtensionActivated()
    } else {
      if (typeof window !== 'undefined') {
        window.open(POLKADOT_EXTENSION_LINK, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <ConnectWalletModalWrapper
      padding='m'
      headerOverModal={<Text size='3XL' color='white'>Welcome to the <b>Statemine</b> Asset Creator!</Text>}
      title='Connect extension to start using this app'
      titleCenterPosition
      isOpen={isOpen}
      onClose={closeModal}
    >
      {extensionStatus === 'Loading'
        ? <Loader />
        : (
          <>
            <ConnectButton onClick={_onClick}>
              <ImageWrapper>
                <Image src={Logo} alt="Polkadot" />
              </ImageWrapper>
              <Text size='SM' color="white">{'Polkadot{.js} extension'}</Text>
              <ArrowLarge direction='right' width='24' height='24' />
            </ConnectButton>
            <Text size='SM'>
              {'Don’t have the Polkadot{.js} extension? Download it '}
              <Link href={POLKADOT_EXTENSION_LINK} target='_blank' rel="noopener noreferrer">here</Link>
            </Text>
            <Text size='SM' color='white'>
              {'By connecting, I accept '}
              <Link href={TOS_PAGE_LINK} target='_blank' rel="noopener noreferrer">Terms of Service</Link>
            </Text>
          </>
        )
      }
    </ConnectWalletModalWrapper>
  )
}

const ConnectWalletModalWrapper = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  ${Text} {
    margin-top: 32px;
  }
`

const ConnectButton = styled.button`
  display: flex;
  align-items: center;
  padding: 24px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.gray900};
  color: ${({ theme }) => theme.colors.gray50};
  cursor: pointer;

  ${Text} {
    margin: 0 16px;
  }
`

const ImageWrapper = styled.div`
  width: 32px;
  height: 32px;
`
