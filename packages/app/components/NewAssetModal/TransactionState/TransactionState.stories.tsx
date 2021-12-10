import type { Story } from '@storybook/react'
import type { ModalProps, TransactionStateProps } from './TransactionState'

import { TransactionStatus } from 'use-substrate'

import { Card } from '../..'
import { TransactionState } from './TransactionState'

const Default = {
  title: 'Components/TransactionState',
  component: TransactionState,
  argTypes: {
    status: {
      control: { type: 'select' },
      options: [TransactionStatus.InBlock, TransactionStatus.Success, TransactionStatus.Error]
    }
  }
}

export default Default

const Template: Story<TransactionStateProps & ModalProps> = (args) =>
  <Card padding='l'>
    <TransactionState {...args} />
  </Card>

export const Base = Template.bind({})
Base.args = {
  status: TransactionStatus.Success,
  title: 'Congratulations!',
  text: 'Your asset have been created.',
  closeModal: () => { /**/ }
}
