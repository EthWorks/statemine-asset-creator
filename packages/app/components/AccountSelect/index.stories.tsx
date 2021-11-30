import { Story } from '@storybook/react'
import React from 'react'

import { mockAccounts } from '../../__tests__/mocks/mockAccounts'
import { MockedApiProvider } from '../../storybookHelpers/MockedApiProvider'
import { AccountSelect, Props } from './index'

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

const Template: Story<Props> = (args) =>
  <MockedApiProvider>
    <AccountSelect {...args}/>
  </MockedApiProvider>

export const Base = Template.bind({})
Base.args = {
  accounts: mockAccounts,
  currentAccount: undefined,
  setCurrentAccount: () => { /**/ }
}

export const BaseWithCurrentAccount = Template.bind({})
BaseWithCurrentAccount.args = {
  accounts: mockAccounts,
  currentAccount: mockAccounts[0],
  setCurrentAccount: () => { /**/ }
}

export const withFreeBalanceAndCurrentAccount = Template.bind({})
withFreeBalanceAndCurrentAccount.args = {
  accounts: mockAccounts,
  currentAccount: mockAccounts[0],
  withFreeBalance: true,
  withAccountInput: false,
  setCurrentAccount: () => { /**/ }
}

export const withAccountInput = Template.bind({})
withAccountInput.args = {
  accounts: mockAccounts,
  currentAccount: undefined,
  withFreeBalance: false,
  withAccountInput: true,
  setCurrentAccount: () => { /**/ }
}

export const withAccountInputAndCurrentAccount = Template.bind({})
withAccountInputAndCurrentAccount.args = {
  accounts: mockAccounts,
  currentAccount: mockAccounts[0],
  withFreeBalance: false,
  withAccountInput: true,
  setCurrentAccount: () => { /**/ }
}
