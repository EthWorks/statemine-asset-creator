import type { InfoProps } from '.'

import { Story } from '@storybook/react'

import { Info } from '.'

const Default = {
  title: 'Components/Info',
  component: Info,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'warning']
    }
  }
}

export default Default

const Template: Story<InfoProps> = (args) =>
  <Info {...args} />

export const Base = Template.bind({})
Base.args = {
  type: 'info',
  text: 'Example text'
}
