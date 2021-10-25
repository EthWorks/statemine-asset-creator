import { fireEvent, render, screen, within } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { Account, useAccounts } from 'use-substrate'

import { PointerEvent } from '../../__tests__/helpers/events'
import { mockAccounts } from '../../__tests__/mocks/mockAccounts'
import { theme } from '../../styles/styleVariables'
import { AccountSelect } from './index'

jest.mock('use-substrate', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const BN = require('bn.js')

  return {
    useBalances: () => ({
      availableBalance: 4000,
      freeBalance: new BN(3600),
      lockedBalance: 300,
      reservedBalance: new BN(1000),
      accountNonce: 1
    }),
    useAccounts: () => ({
      allAccounts: mockAccounts,
      hasAccounts: true
    }),
    Chains: () => ({
      Kusama: 'kusama',
      Statemine: 'statemine'
    })
  }
})

function AccountSelectTestComponent(): JSX.Element {
  const accounts = useAccounts()
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  return (
    <ThemeProvider theme={theme}>
      <AccountSelect
        accounts={accounts.allAccounts}
        currentAccount={account}
        setCurrentAccount={setAccount}
      />
    </ThemeProvider>
  )
}

describe('AccountSelect component', () => {
  it('displays current account info on load', async () => {
    render(<AccountSelectTestComponent/>)

    await screen.findByText(mockAccounts[0].name)
    await screen.findByText(mockAccounts[0].address)

    const transferableBalanceElement = (await screen.findByText('transferable balance')).parentElement
    expect(transferableBalanceElement?.textContent).toEqual('transferable balance4000KSM')
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

    await within(dropdownMenu).findByText('ALICE')
    await within(dropdownMenu).findByText('BOB')
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

    await within(openDropdownButton).findByText('BOB')
    expect(await within(openDropdownButton).queryAllByAltText('ALICE')).toHaveLength(0)
  })
})
