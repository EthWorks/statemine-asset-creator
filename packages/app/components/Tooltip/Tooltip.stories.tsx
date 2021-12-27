import type { Story } from '@storybook/react'
import type { TooltipBoxProps } from './index'

import { TooltipBox } from './index'

const Default = {
  title: 'Components/TooltipBox',
  component: TooltipBox,
  parameters: {
    layout: 'centered'
  }
}

export default Default

const Template: Story<TooltipBoxProps> = (args) => <TooltipBox {...args} />

export const Base = Template.bind({})
Base.args = {
  text: 'Your account needs to have some funds to stay active and have Existential Deposit'
}
