import React, { useEffect, useState } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Account, useAccounts } from 'use-substrate'
import { AccountSelect } from './index'
import { mockAccounts } from '../../__tests__/mocks/mockAccounts'
import { PointerEvent } from '../../__tests__/helpers/events'

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
  }, [accounts.allAccounts])

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
    render(<AccountSelectTestComponent/>)

    await screen.findByText(`Account Name: ${mockAccounts[0].name}`)
    await screen.findByText(`Account Address: ${mockAccounts[0].address}`)
    await screen.findByText('Full Account Balance: 3600')
    await screen.findByText('Transferable Balance: 4000')
  })

  it('displays accounts in dropdown', async () => {
    render(<AccountSelectTestComponent/>)

    const openDropdownButton = await screen.findByRole('button')

    fireEvent.pointerDown(
      openDropdownButton,
      new PointerEvent('pointerdown', {
        ctrlKey: false,
        button: 0,
      })
    )

    const dropdownMenu = await screen.findByRole('menu')

    await within(dropdownMenu).findByText('Account Name: ALICE')
    await within(dropdownMenu).findByText('Account Name: BOB')
  })

  it('sets selected account as current account', async () => {
    render(<AccountSelectTestComponent/>)

    const openDropdownButton = await screen.findByRole('button')

    fireEvent.pointerDown(
      openDropdownButton,
      new PointerEvent('pointerdown', {
        ctrlKey: false,
        button: 0,
      })
    )

    const dropdownMenu = await screen.findByRole('menu')

    const menuItems = await within(dropdownMenu).findAllByRole('menuitem')

    fireEvent.click(menuItems[1])

    await within(openDropdownButton).findByText('Account Name: BOB')
    expect(await within(openDropdownButton).queryAllByAltText('Account Name: ALICE')).toHaveLength(0)
  })
})