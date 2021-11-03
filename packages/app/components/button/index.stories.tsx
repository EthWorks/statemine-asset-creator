import { BaseButtonStyle } from './Button'

const Default = {
  title: 'Components/Button',
  component: BaseButtonStyle,
  argTypes: {
    disabled: { 
      defaultValue: false,
      control: { 
        type: 'boolean'
      }
    },
    large: false
  }
}

export default Default

export * from './Button.stories'
export * from './CloseButton.stories'
