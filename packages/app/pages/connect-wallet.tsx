import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAccounts } from 'use-substrate'

import { Link, Text } from '../components'
import Card from '../components/Card/Card'
import styles from '../styles/Home.module.css'
import { DASHBOARD_URL, POLKADOT_EXTENSION_LINK } from '../utils/consts'
import { useAsync } from '../utils/useAsync'

const ConnectWallet: NextPage =  () => {
  const router = useRouter()
  const { web3Enable, extensionStatus } = useAccounts()

  async function redirect(): Promise<void> {
    const extensionActivated = localStorage.getItem('extensionActivated')
    if (extensionActivated === 'true') {
      await web3Enable()
      await router.push(DASHBOARD_URL)
    }
  }

  useAsync(redirect, [web3Enable])

  const _onClick = async (): Promise<void> => {
    if (extensionStatus === 'Available') {
      await web3Enable()
      localStorage.setItem('extensionActivated', 'true')
      await router.push(DASHBOARD_URL)
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
