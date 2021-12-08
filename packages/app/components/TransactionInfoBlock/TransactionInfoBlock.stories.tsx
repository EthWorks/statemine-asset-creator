import type { TransactionInfoBlockProps } from './TransactionInfoBlock'

import { Story } from '@storybook/react'
import BN from 'bn.js'

import { Card } from '../Card'
import { FormatBalance } from '../FormatBalance'
import { Label, Text } from '../typography'
import { InfoRow, TransactionInfoBlock } from './TransactionInfoBlock'

const Default = {
  title: 'Components/TransactionInfoBlock',
  component: TransactionInfoBlock,
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['waiting', 'sign', 'done', false]
    }
  }
}

export default Default

const Template: Story<TransactionInfoBlockProps> = (args) =>
  <Card padding='l'>
    <TransactionInfoBlock {...args}>
      <InfoRow>
        <Label>Chain</Label>
        <Text size='XS' color='white' bold>statemine</Text>
      </InfoRow>
      <InfoRow>
        <Label>Deposit</Label>
        <FormatBalance chainDecimals={6} token='ksm' value={new BN('1234567891')} />
      </InfoRow>
      <InfoRow>
        <Label>Kusama Fee</Label>
        <FormatBalance chainDecimals={3} token='ksm' value={new BN('1234567891')} />
      </InfoRow>
      <InfoRow>
        <Label>Statemine Fee</Label>
        <FormatBalance chainDecimals={5} token='ksm' value={new BN('1234567891')} />
      </InfoRow>
    </TransactionInfoBlock>
  </Card>

export const Base = Template.bind({})
Base.args = {
  name: 'Teleport',
  number: 1
}
