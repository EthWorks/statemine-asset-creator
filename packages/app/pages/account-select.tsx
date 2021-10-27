import type { Account } from 'use-substrate'

import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useAccounts } from 'use-substrate'

import { AccountSelect } from '../components'
import Card from '../components/Card/Card'
import { DASHBOARD_URL } from '../utils/consts'

const AccountSelectPage: NextPage =  () => {
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])
  const router = useRouter()

  const _onClick = async (): Promise<void> => {
    localStorage.setItem('activeAccount', account.address)
    await router.push(DASHBOARD_URL)
  }

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  if (!accounts.allAccounts.length || !account) return <>Loading..</>

  return (
    <Card>
      <AccountSelect accounts={accounts.allAccounts} currentAccount={account} setCurrentAccount={setAccount}/>
      <button onClick={_onClick}>Connect</button>
      { accounts.error === 'EXTENSION' && <div>No extension available</div>}
    </Card>
  )
}

export default AccountSelectPage
