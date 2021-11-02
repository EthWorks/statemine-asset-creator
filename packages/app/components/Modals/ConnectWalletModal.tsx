import { useAccounts } from 'use-substrate'

import { POLKADOT_EXTENSION_LINK } from '../../utils'
import { useLocalStorage } from '../../utils/hooks/useLocalStorage'
import { Link, Modal, Text } from '../index'

interface Props {
  closeModal: () => void
  isOpen: boolean,
  onExtensionActivated: () => void
}

export function ConnectWalletModal({ isOpen, closeModal, onExtensionActivated }: Props): JSX.Element {
  const [, setExtensionActivated] = useLocalStorage('extensionActivated')
  const { web3Enable, extensionStatus } = useAccounts()

  const _onClick = async (): Promise<void> => {
    if (extensionStatus === 'Available') {
      await web3Enable()
      setExtensionActivated('true')
      onExtensionActivated()
    } else {
      if (typeof window !== 'undefined') {
        window.open(POLKADOT_EXTENSION_LINK, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {extensionStatus === 'Loading'
        ? <Text color='white'>Loading...</Text>
        : (
          <>
            <Text color='white'>Connect Wallet to start using app</Text>
            <button onClick={_onClick}>{'Polkadot{.js} extension'}</button>
            <Text color='white'>
              {'Don’t have the Polkadot{.js} extension? Download it '}
              <Link href={POLKADOT_EXTENSION_LINK}>here</Link>
            </Text>
          </>
        )
      }
    </Modal>
  )
}
