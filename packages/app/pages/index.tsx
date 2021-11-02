import type { NextPage } from 'next'

import Head from 'next/head'
import { useEffect, useState } from 'react'

import { Chains, useAccounts, useBalances } from 'use-substrate'

import { AccountSelectModal, ConnectWalletModal, NewAssetModal } from '../components'
import styles from '../styles/Home.module.css'
import { activeAccountSet, extensionActivated, useAsync, useToggle } from '../utils'

const Home: NextPage =  () => {
  const [account] = useState<string | null>(localStorage.getItem('activeAccount'))
  const [isNewAssetModalOpen, toggleNewAssetModalOpen] = useToggle()
  const [isConnectWalletModalOpen, toggleConnectWalletModalOpen, setConnectWalletModalOpen] = useToggle()
  const [isAccountSelectModalOpen, toggleSelectAccountModalOpen, setSelectAccountModalOpen] = useToggle()

  const balances = useBalances(account, Chains.Kusama)
  const statemineBalances = useBalances(account, Chains.Statemine)
  const { allAccounts, web3Enable } = useAccounts()

  const onExtensionActivated = (): void => {
    setConnectWalletModalOpen(false)
    setSelectAccountModalOpen(true)
  }

  useEffect(() => {
    if(!extensionActivated()) {
      setConnectWalletModalOpen(true)
    }
  }, [])

  async function openAccountSelectModal(): Promise<boolean | void> {
    if(!extensionActivated()) return

    await web3Enable()

    if(!activeAccountSet()) {
      setSelectAccountModalOpen(true)
    }
  }

  useAsync(openAccountSelectModal, [web3Enable])

  return (
    <div className={styles.container}>
      <Head>
        <title>Statemine Asset Creator</title>
        <meta name="description" content="Application for managing assets on Statemine" />
      </Head>

      <main className={styles.main}>
        <ConnectWalletModal isOpen={isConnectWalletModalOpen} closeModal={toggleConnectWalletModalOpen} onExtensionActivated={onExtensionActivated}/>
        <AccountSelectModal isOpen={isAccountSelectModalOpen} closeModal={toggleSelectAccountModalOpen} />
        <div>
          {!isNewAssetModalOpen && <button onClick={toggleNewAssetModalOpen}>Create new asset</button>}
          <NewAssetModal isOpen={isNewAssetModalOpen} closeModal={toggleNewAssetModalOpen}/>
        </div>
        <div data-testid='active-account-container'>
          <p>
            {account}
          </p>
          <p className={styles.description}>
              Balance: {balances?.freeBalance.toString()}
          </p>
          <p className={styles.description}>
              Statemine Balance: {statemineBalances?.freeBalance.toString()}
          </p>
        </div>
        <h1 className={styles.title}>
          Welcome to Statemine
        </h1>

        <div>Extension accounts:</div>
        <ul>
          {allAccounts.map((account, index) =>
            <li key={index}>address: {account.address} name: {account.name}</li>)
          }
        </ul>
      </main>
    </div>
  )
}

export default Home
