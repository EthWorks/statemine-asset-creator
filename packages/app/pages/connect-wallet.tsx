import { NextPage } from 'next'

import { useAccounts } from 'use-substrate'

import styles from '../styles/Home.module.css'

const ConnectWallet: NextPage =  () => {
  const { web3Enable } = useAccounts()

  return (
    <div className={styles.container}>
      <div>Connect Wallet to start using app</div>
      <button onClick={web3Enable}>{'Polkadot{.js} extension'}</button>
    </div>
  )
}

export default ConnectWallet
