import { Story } from '@storybook/react'

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
    titleCenterPosition: false,
  }
}

export default Default

const Template: Story<ModalProps> = (args) =>
  <Modal {...args}>
    <h1 style={{color: '#ffffff'}}>Modal content</h1>
  </Modal>


export const Base = Template.bind({})
Base.args = {
  padding:'s',
  size: 'm',
  title: 'Modal title',
  titleCenterPosition: false
}
