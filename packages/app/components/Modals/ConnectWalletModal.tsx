import Image from 'next/image'
import styled from 'styled-components'

import { useAccounts } from 'use-substrate'

import Logo from '../../assets/img/polkadot.png'
import { POLKADOT_EXTENSION_LINK } from '../../utils'
import { ArrowLarge } from '../icons/ArrowLarge'
import { Link, Modal, Text } from '../index'

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
      headerOverModal={<Text size='3XL' color='white'>Welcome to <b>Statemine</b> Asset Creator!</Text>}
      title='Connect Wallet to start using app'
      titleCenterPosition
      isOpen={isOpen}
      onClose={closeModal}
    >
      {extensionStatus === 'Loading'
        ? <Text color='white'>Loading...</Text>
        : (
          <>
            <ConnectButton onClick={_onClick}>
              <Image src={Logo} alt="Polkadot" />
              <Text size='SM' color="white">{'Polkadot{.js} extension'}</Text>
              <ArrowLarge direction='right' width='24' height='24' />
            </ConnectButton>
            <Text size='SM'>
              {'Don’t have the Polkadot{.js} extension? Download it '}
              <Link href={POLKADOT_EXTENSION_LINK}>here</Link>
            </Text>
            <Text size='SM' color='white'>
              {'By connecting, I accept '}
              <Link href=''>Terms of Service</Link>
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
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;

  ${Text} {
    margin: 0 16px;
  }
`
