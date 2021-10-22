import { NextPage } from 'next'

import { useAccounts } from 'use-substrate'

import { Link, Text } from '../components'
import Card from '../components/Card/Card'
import styles from '../styles/Home.module.css'
import { POLKADOT_EXTENSION_LINK } from '../utils/consts'

const ConnectWallet: NextPage =  () => {
  const { web3Enable, extensionStatus } = useAccounts()

  const _onClick = (): void => {
    if (extensionStatus === 'Available') {
      web3Enable()
    } else {
      if (typeof window !== 'undefined') {
        window.open(POLKADOT_EXTENSION_LINK, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <div className={styles.container}>
      <Card padding='l'>
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
      </Card>
    </div>
  )
}

export default ConnectWallet
