import type { Story } from '@storybook/react'
import type { Account } from 'use-substrate'
import type { Props } from './index'

import React from 'react'

import { mockAccounts } from '../../__tests__/mocks/mockAccounts'
import { MockedApiProvider } from '../../storybookHelpers/MockedApiProvider'
import { AccountSelect } from './index'

const Default = {
  title: 'Components/AccountSelect',
  component: AccountSelect,
  parameters: {
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: 'rgba(0,0,0,0.5)' }
      ]
    }
  }
}

export default Default

const Template: Story<Props> = (args) => {
  const [currentAccount, setCurrentAccount] = React.useState<Account | undefined>(args.currentAccount)

  return (
    <MockedApiProvider>
      <AccountSelect {...args} currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>
    </MockedApiProvider>
  )
}

export const Base = Template.bind({})
Base.args = {
  accounts: mockAccounts,
  currentAccount: undefined
}

export const withFreeBalance = Template.bind({})
withFreeBalance.args = {
  accounts: mockAccounts,
  currentAccount: undefined,
  withFreeBalance: true,
  withAccountInput: false,
  disabled: false
}

export const withAccountInput = Template.bind({})
withAccountInput.args = {
  accounts: mockAccounts,
  currentAccount: undefined,
  withFreeBalance: false,
  withAccountInput: true,
  disabled: false
}

export const disabled = Template.bind({})
disabled.args = {
  accounts: mockAccounts,
  currentAccount: mockAccounts[0],
  withFreeBalance: true,
  withAccountInput: false,
  disabled: true
}
