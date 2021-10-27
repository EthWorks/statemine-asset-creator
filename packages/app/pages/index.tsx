import type { NextPage } from 'next'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Chains, useAccounts, useBalances } from 'use-substrate'


import { AccountSelect, Modal, Text, NewAssetModal } from '../components'

import styles from '../styles/Home.module.css'
import {
  ACCOUNT_SELECT_URL,
  activeAccountSet,
  CONNECT_WALLET_URL,
  extensionActivated,
  useAsync,
  useToggle
} from '../utils'

const Home: NextPage =  () => {
  const [account] = useState<string | null>(localStorage.getItem('activeAccount'))
  const [isModalOpen, toggleModalOpen] = useToggle(false)
  const balances = useBalances(account, Chains.Kusama)
  const statemineBalances = useBalances(account, Chains.Statemine)
  const { allAccounts, web3Enable } = useAccounts()
  const router = useRouter()


  async function redirect(): Promise<boolean | void> {
    if(!extensionActivated()) {
      return router.push(CONNECT_WALLET_URL)
    }

    await web3Enable()

    if(!activeAccountSet()) {
      return router.push(ACCOUNT_SELECT_URL)
    }
  }

  useAsync(redirect, [web3Enable])

  if (!extensionActivated() || !activeAccountSet() || !account) {
    return <>Loading...</>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Statemine Asset Creator</title>
        <meta name="description" content="Application for managing assets on Statemine" />
      </Head>

      <main className={styles.main}>
        <div>
          {!isModalOpen && <button onClick={toggleModalOpen}>Create new asset</button>}
          {isModalOpen && (
            <NewAssetModal closeModal={toggleModalOpen}/>
          )}
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
