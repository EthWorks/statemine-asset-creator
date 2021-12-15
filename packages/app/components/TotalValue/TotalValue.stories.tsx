import type { Story } from '@storybook/react'
import type { TotalValueProps } from './index'

import BN from 'bn.js'

import { TotalValue } from './index'

const Default = {
  title: 'Components/TotalValue',
  component: TotalValue,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: 'rgba(0,0,0,1)' }
      ]
    }
  }
}

export default Default

const Template: Story<TotalValueProps> = (args) =>
  <TotalValue {...args}/>

export const Base = Template.bind({})
Base.args = {
  decimalsAmount: 6,
  decimalsFee: 5,
  totalAmount: new BN('12367891'),
  totalFee: new BN('00654298'),
  token: 'KSM'
}
