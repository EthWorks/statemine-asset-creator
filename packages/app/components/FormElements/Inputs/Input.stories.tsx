import { Story } from '@storybook/react'

import { CustomInputProps, InputBase } from './InputBase'

const Default = {
  title: 'Components/Input',
  component: InputBase,
  parameters: {
    backgrounds: {
      default: 'black',
      values: [
        { name: 'black', value: 'rgba(0,0,0,1)' }
      ]
    }
  }
}

export default Default

const Template: Story<CustomInputProps> = (args) => <InputBase label='Input label' {...args}/>

export const Base = Template.bind({})
Base.args = {}

export const WithButton = Template.bind({})
WithButton.args = {
  button: {
    label: 'Button label',
    onClick: () => {
      console.log('Button clicked')
    }
  }
}
