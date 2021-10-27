import { Story } from '@storybook/react'

import CloseButton,{ CloseButtonProps } from './CloseButton'

const Default = {
  title: 'Components/Button',
  component: CloseButton
}

export default Default

const Template: Story<CloseButtonProps> = (args) =>
  <CloseButton {...args} />

export const Close = Template.bind({})
Close.args = {}
