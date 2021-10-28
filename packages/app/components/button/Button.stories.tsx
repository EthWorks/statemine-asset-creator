import { Story } from '@storybook/react'

import { BaseButtonStyle, ButtonOutline, ButtonPrimary, ButtonProps } from './Button'

interface ButtonPropsStories extends ButtonProps{
  disabled: boolean,
}

const Default = {
  title: 'Components/Button',
  component: BaseButtonStyle,
  argTypes: {
    disabled: false,
    large: false
  }
}

export default Default

const TemplatePrimary: Story<ButtonPropsStories> = (args) =>
  <ButtonPrimary {...args}>
    Primary button
  </ButtonPrimary>

const TemplateOutline: Story<ButtonPropsStories> = (args) =>
  <ButtonOutline {...args}>
    Outline button
  </ButtonOutline>

export const Primary = TemplatePrimary.bind({})
Primary.args = {
  large: false,
  disabled: false
}

export const Outline = TemplateOutline.bind({})
Outline.args = {
  large: false,
  disabled: false
}
