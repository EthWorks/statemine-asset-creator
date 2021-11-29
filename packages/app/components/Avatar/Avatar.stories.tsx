import { Story } from '@storybook/react'

import Avatar, { AvatarProps } from './Avatar'

const Default = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['s', 'm'],
    }
  }
}

export default Default

const Template: Story<AvatarProps> = (args) =>
  <Avatar {...args}/>

export const Base = Template.bind({})
Base.args = { size:'m' }
