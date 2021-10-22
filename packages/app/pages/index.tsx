import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useBalances, useAccounts, JACO, Account } from 'use-substrate'
import { AccountSelect } from '../components'
import { useEffect, useState } from 'react'

const Home: NextPage =  () => {
  const balances = useBalances(JACO)
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])

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
        <p className={styles.description}>
         Balance: {balances?.freeBalance.toString()}
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
      </main>
    </div>
  )
}

export default Home
