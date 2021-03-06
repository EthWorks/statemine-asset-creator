import type { ChainIdentifierProps } from '.'

import { Story } from '@storybook/react'

import { Chains } from 'use-substrate'

import { ChainIdentifier } from '.'

const Default = {
  title: 'Components/ChainIdentifier',
  component: ChainIdentifier,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'black',
      values: [
        { name: 'black', value: '#000000' }
      ]
    }
  },
  argTypes: {
    chainMain: {
      control: { type: 'select' }
    },
    chainTo: {
      control: { type: 'select' }
    }
  }
}

export default Default

const Template: Story<ChainIdentifierProps> = (args) =>
  <ChainIdentifier {...args} />

export const Base = Template.bind({})
Base.args = { chainMain: Chains.Statemine }
