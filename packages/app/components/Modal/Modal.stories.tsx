import { Story } from '@storybook/react'

import { Text } from '../typography/Text'
import Modal, { ModalProps } from './Modal'

const Default = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
    },
    size: {
      control: { type: 'select' },
      options: ['m', 'l'],
    },
    isOpen: true,
    titleCenterPosition: false,
    headerOverModal: <Text size='3XL' color='white'>Welcome to <b>Statemine</b> Asset Creator!</Text>
  }
}

export default Default

const Template: Story<ModalProps> = (args) =>
  <Modal {...args}>
    <h1 style={{ color: '#ffffff' }}>Modal content</h1>
  </Modal>

export const Base = Template.bind({})
Base.args = {
  padding:'s',
  size: 'm',
  title: 'Modal title',
  titleCenterPosition: false,
  isOpen: true,
  headerOverModal: <Text size='3XL' color='white'>Welcome to <b>Statemine</b> Asset Creator!</Text>
}
