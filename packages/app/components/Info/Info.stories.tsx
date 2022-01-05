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
  text: 'Example text'
}

export const Warning = Template.bind({})
Warning.args = {
  type: 'warning',
  text: 'Example text'
}

export const WarningWithAction = Template.bind({})
WarningWithAction.args = {
  type: 'warning',
  text: 'Example text',
  action: {
    name: 'Click here',
    onClick: () => console.log('Clicked!')
  }
}
