import React, { useEffect, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Account, useAccounts } from 'use-substrate'
import { AccountSelect } from './index'
import { mockAccounts } from '../../mocks/mockAccounts'

global.ResizeObserver = class ResizeObserver {
  cb: any
  constructor(cb: any) {
    this.cb = cb
  }
  observe(): void {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }])
  }
  unobserve(): void {}
  disconnect(): void {}
}

global.DOMRect = {
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0,  x: 0, y: 0, toJSON: () => null }),
} as unknown as DOMRect

jest.mock('use-substrate', () => ({
  useBalances: () => ({
    freeBalance: 3600,
    availableBalance: 4000,
    lockedBalance: 300,
    accountNonce: 1
  }),
  useAccounts: () => ({
    allAccounts: mockAccounts,
    hasAccounts: true
  })
}))

function AccountSelectTestComponent(): JSX.Element {
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts])

  return (
    <AccountSelect
      accounts={accounts.allAccounts}
      currentAccount={account}
      setCurrentAccount={setAccount}
    />
  )
}

describe('Component AccountSelect', () => {
  it('Displays current account info on load', async () => {
    render(<AccountSelectTestComponent />)

    await screen.findByText(`Account Name: ${mockAccounts[0].name}`)
    await screen.findByText(`Account Address: ${mockAccounts[0].address}`)
    await screen.findByText('Full Account Balance: 3600')
    await screen.findByText('Transferable Balance: 4000')
  })

  it('displays accounts in dropdown', async () => {
    render(<AccountSelectTestComponent />)

    const openDropdownButton = await screen.findByRole('button')
    fireEvent.click(openDropdownButton)

    await screen.findByText('Account Name: ALICE')
    await screen.findByText('Account Name: BOB')
  })
})
