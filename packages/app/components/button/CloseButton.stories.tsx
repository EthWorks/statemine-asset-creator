import { Story } from '@storybook/react'

import { CloseButton } from './CloseButton'

const Template: Story = (args) =>
  <CloseButton {...args} />

export const Close = Template.bind({})
Close.args = {}
