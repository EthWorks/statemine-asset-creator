import type { Story } from '@storybook/react'
import type { FeeSelectProps } from './index'

import { FeeSelect } from './index'

const Default = {
  title: 'Components/FeeSelect',
  component: FeeSelect,
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

const Template: Story<FeeSelectProps> = (args) => <FeeSelect {...args}/>

export const Base = Template.bind({})
Base.args = {}
