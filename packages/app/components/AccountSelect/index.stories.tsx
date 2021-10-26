import { Story } from '@storybook/react'
import React from 'react'

import { mockAccounts } from '../../__tests__/mocks/mockAccounts'
import { MockedApiProvider } from '../../storybookHelpers/MockedApiProvider'
import { AccountSelect, Props } from './index'

const Default = {
  title: 'Components/AccountSelect',
  component: AccountSelect,
}

export default Default

const Template: Story<Props> = (args) =>
  <MockedApiProvider>
    <AccountSelect {...args}/>
  </MockedApiProvider>

export const Base = Template.bind({})
Base.args = {
  accounts: mockAccounts,
  currentAccount: mockAccounts[0],
  setCurrentAccount: () => {/**/}
}

export const Secondary = Template.bind({})
Secondary.args = {
  accounts: mockAccounts,
  currentAccount: mockAccounts[0],
  withFreeBalance: true,
  setCurrentAccount: () => {/**/}
}
