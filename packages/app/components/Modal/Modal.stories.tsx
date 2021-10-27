import { Story } from '@storybook/react'

import { Text } from '../typography/Text'
import Index, { ModalProps } from './index'

const defaultHeader = <Text size='3XL' color='white'>Welcome to <b>Statemine</b> Asset Creator!</Text>
const empty = <></>

const headers = { defaultHeader, empty }

const Default = {
  title: 'Components/Index',
  component: Index,
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
    },
    size: {
      control: { type: 'select' },
      options: ['m', 'l'],
    },
    headerOverModal: {
      options: Object.keys(headers),
      mapping: headers,
      control: {
        type: 'select',
        labels: {
          defaultModalHeader: 'default header',
          empty: ''
        },
      },
      defaultValue: 'defaultHeader'
    },
  }
}

export default Default

const Template: Story<ModalProps> = (args) =>
  <Index {...args}>
    <h1 style={{ color: '#ffffff' }}>Modal content</h1>
  </Index>

export const Base = Template.bind({})
Base.args = {
  padding:'s',
  size: 'm',
  title: 'Index title',
  titleCenterPosition: false,
  isOpen: true,
  headerOverModal: 'defaultHeader'
}
