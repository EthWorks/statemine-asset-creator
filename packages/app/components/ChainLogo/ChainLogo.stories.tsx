import type { ChainLogoProps } from '.'

import { Story } from '@storybook/react'

import { Chains } from 'use-substrate'

import { ChainLogo } from '.'

const Default = {
  title: 'Components/ChainLogo',
  component: ChainLogo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: 'rgba(0,0,0,0.5)' }
      ]
    }
  },
  argTypes: {
    chain: {
      control: { type: 'select' }
    }
  }
}

export default Default

const Template: Story<ChainLogoProps> = (args) =>
  <ChainLogo {...args} />

export const Base = Template.bind({})
Base.args = { chain: Chains.Polkadot }
