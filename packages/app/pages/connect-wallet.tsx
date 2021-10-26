import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useAccounts } from 'use-substrate'

import { Link, Text } from '../components'
import Card from '../components/Card/Card'
import styles from '../styles/Home.module.css'
import { ACCOUNT_SELECT_URL, POLKADOT_EXTENSION_LINK } from '../utils/consts'
import { useAsync } from '../utils/useAsync'

const ConnectWallet: NextPage =  () => {
  const router = useRouter()
  const { web3Enable, extensionStatus } = useAccounts()

  function alreadyActivated (): boolean {
    return localStorage.getItem('extensionActivated') === 'true'
  }

  async function redirect(): Promise<void> {
    if (alreadyActivated()) {
      await web3Enable()
      await router.push(ACCOUNT_SELECT_URL)
    }
  }

  useAsync(redirect, [web3Enable])

  const _onClick = async (): Promise<void> => {
    if (extensionStatus === 'Available') {
      await web3Enable()
      localStorage.setItem('extensionActivated', 'true')
      await router.push(ACCOUNT_SELECT_URL)
    } else {
      if (typeof window !== 'undefined') {
        window.open(POLKADOT_EXTENSION_LINK, '_blank', 'noopener,noreferrer')
      }
    }
  }

  if (alreadyActivated()) {
    return null
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
