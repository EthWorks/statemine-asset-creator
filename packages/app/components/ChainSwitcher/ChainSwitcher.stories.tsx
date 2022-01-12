import { Story } from '@storybook/react'

import { ChainSwitcher } from '.'

const Default = {
  title: 'Components/ChainSwitcher',
  component: ChainSwitcher
}

export default Default

const Template: Story = (args) =>
  <ChainSwitcher {...args} />

export const Base = Template.bind({})
Base.args = {}
