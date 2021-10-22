import { Story } from '@storybook/react'

import Card, { CardProps } from './Card'

const Default = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
    }
  }
}

export default Default

const Template: Story<CardProps> = (args ) =>
  <Card {...args} style={{ width: 'fit-content' }}>
    <h1 style={{ color: '#ffffff' }}>Card example</h1>
  </Card>

export const Base = Template.bind({})
Base.args = { padding:'s' }