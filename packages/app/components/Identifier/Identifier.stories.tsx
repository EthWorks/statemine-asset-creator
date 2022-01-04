import type { IdentifierProps } from '.'

import { Story } from '@storybook/react'

import { Identifier } from '.'

const Default = {
  title: 'Components/Identifier',
  component: Identifier,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: 'rgba(0,0,0)' }
      ]
    }
  },
  argTypes: {
    chainFrom: {
      control: { type: 'select' }
    },
    chainTo: {
      control: { type: 'select' }
    }
  }
}

export default Default

const Template: Story<IdentifierProps> = (args) =>
  <Identifier {...args} />

export const Base = Template.bind({})
Base.args = {}
