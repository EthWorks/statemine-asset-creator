import { Story } from '@storybook/react'

import { Text, TextProps } from './Text'

const Default = {
  title: 'Components/Typography/Text',
  component: Text,
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['black', 'green', 'indigo', 'pink', 'red', 'white'],
    }
  }
}

export default Default

const Template: Story<TextProps> = (args) =>
  <Text {...args}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus nibh vitae odio tristique maximus.</Text>

export const Base = Template.bind({})
Base.args = { color: 'black' }
