import type { Account } from 'use-substrate'

import { useEffect, useState } from 'react'

import { useAccounts } from 'use-substrate'

import { useLocalStorage } from '../../utils/hooks/useLocalStorage'
import { AccountSelect } from '../AccountSelect'
import { Modal, Text } from '../index'

interface Props {
  closeModal: () => void
  isOpen: boolean,
}

export function AccountSelectModal({ closeModal, isOpen }: Props): JSX.Element {
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])
  const [, setActiveAccount] = useLocalStorage('activeAccount')

  const _onClick = async (): Promise<void> => {
    setActiveAccount(account.address)
    closeModal()
  }

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  if (!accounts.allAccounts.length || !account) return <>Loading..</>

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <Text color='white'>Connect accounts</Text>
      <AccountSelect accounts={accounts.allAccounts} currentAccount={account} setCurrentAccount={setAccount}/>
      <button onClick={_onClick}>Connect</button>
      { accounts.error === 'EXTENSION' && <div>No extension available</div>}
    </Modal>
  )
}
