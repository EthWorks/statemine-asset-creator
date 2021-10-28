import { Story } from '@storybook/react'

import { CloseButton } from './CloseButton'

const Default = {
  title: 'Components/Button',
  component: CloseButton
}

export default Default

const Template: Story = (args) =>
  <CloseButton {...args} />

export const Close = Template.bind({})
Close.args = {}
