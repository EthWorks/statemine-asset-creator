import type { Story } from '@storybook/react'
import type { TransactionCostSummaryProps } from './index'

import BN from 'bn.js'

import { TransactionCostSummary } from './index'

const Default = {
  title: 'Components/TransactionCostSummary',
  component: TransactionCostSummary,
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

const Template: Story<TransactionCostSummaryProps> = (args) =>
  <TransactionCostSummary {...args}/>

export const Base = Template.bind({})
Base.args = {
  decimalsAmount: 6,
  decimalsFee: 5,
  totalAmount: new BN('12367891'),
  totalFee: new BN('00654298'),
  token: 'KSM'
}
