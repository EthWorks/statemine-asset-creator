import { Story } from '@storybook/react'

import { AccountSelect, Props } from './index'

const Default = {
  title: 'Components/AccountSelect',
  component: AccountSelect,
}

export default Default

const Template: Story<Props> = (args ) =>
  <AccountSelect {...args}/>

export const Base = Template.bind({})
