import type { Story } from '@storybook/react'
import type { StatusStepProps } from './StatusStep'

import { Card } from '../..'
import { StatusStep } from './StatusStep'

const Default = {
  title: 'Components/StatusStep',
  component: StatusStep,
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending', 'complete', 'fail']
    }
  }
}

export default Default

const Template: Story<StatusStepProps> = (args) =>
  <Card padding='l'>
    <StatusStep {...args} />
  </Card>

export const Base = Template.bind({})
Base.args = {
  status: 'complete',
  title: 'Congratulations!',
  text: 'Your asset have been created.'
}
