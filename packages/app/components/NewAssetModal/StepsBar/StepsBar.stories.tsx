import type { StepsBarProps } from './StepsBar'

import { Story } from '@storybook/react'

import { StepsBar } from './StepsBar'

const Default = {
  title: 'Components/StepsBar',
  component: StepsBar,
  argTypes: {
    optional: {
      control: { type: 'boolean' },
    },
    stepNumber: {
      control: { type: 'select' },
      options: [0 , 1, 2, 3]
    }
  }
}

export default Default

const Template: Story<StepsBarProps> = (args ) =>
  <StepsBar {...args} />

export const Base = Template.bind({})
Base.args = { stepNumber: 1 }
