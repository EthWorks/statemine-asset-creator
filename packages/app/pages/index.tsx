import type { NextPage } from 'next'

import Head from 'next/head'
import { useState } from 'react'

import { Chains, useAccounts, useBalances } from 'use-substrate'

import styles from '../styles/Home.module.css'

const Home: NextPage =  () => {
  const [account] = useState<string | null>(localStorage.getItem('activeAccount'))
  const balances = useBalances(account, Chains.Kusama)
  const statemineBalances = useBalances(account, Chains.Statemine)
  const accounts = useAccounts()

  if (!account) return <>Loading..</>

  return (
    <div className={styles.container}>
      <Head>
        <title>Statemine Asset Creator</title>
        <meta name="description" content="Application for managing assets on Statemine" />
      </Head>

      <main className={styles.main}>
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
          {accounts.allAccounts.map((account, index) =>
            <li key={index}>address: {account.address} name: {account.name}</li>)
          }
        </ul>
      </main>
    </div>
  )
}

export default Home
