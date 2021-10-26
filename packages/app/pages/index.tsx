import type { NextPage } from 'next'
import type { Account } from 'use-substrate'

import Head from 'next/head'
import { useEffect, useState } from 'react'

import { Chains, JACO, useAccounts, useBalances } from 'use-substrate'

import { AccountSelect, Text } from '../components'
import Modal from '../components/Modal/Modal'
import styles from '../styles/Home.module.css'

const Home: NextPage =  () => {
  const balances = useBalances(JACO, Chains.Kusama)
  const statmineBalances = useBalances(JACO, Chains.Statemine)
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  return (
    <div className={styles.container}>
      <Head>
        <title>Statemine Asset Creator</title>
        <meta name="description" content="Application for managing assets on Statemine" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Statemine
        </h1>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size='l'
          title='Example title'
          padding='s'
          headerOverModal={<Text size='3XL' color='white'>Welcome to <b>Statemine</b> Asset Creator!</Text>}
        >
          Modal content
        </Modal>

        <p className={styles.description}>
            Balance: {balances?.freeBalance.toString()}
        </p>
        <p className={styles.description}>
            Statemine Balance: {statmineBalances?.freeBalance.toString()}
        </p>
        <div>Extension accounts:</div>
        <ul>
          {accounts.allAccounts.map((account, index) =>
            <li key={index}>address: {account.address} name: {account.name}</li>)
          }
        </ul>
        {accounts && account && (
          <AccountSelect currentAccount={account} setCurrentAccount={setAccount} accounts={accounts.allAccounts}/>
        )}
        { accounts.error === 'EXTENSION' && <div>No extension available</div>}
        <button onClick={() => setIsModalOpen(true)}>Show Modal</button>
      </main>
    </div>
  )
}

export default Home
