import { Story } from '@storybook/react'

import { BaseButtonStyle, ButtonOutline, ButtonPrimary, ButtonProps } from './Button'

const Default = {
  title: 'Components/Button',
  component: BaseButtonStyle,
  argTypes: {
    disabled: false,
    large: false
  }
}

export default Default

const TemplatePrimary: Story<ButtonProps> = (args) =>
  <ButtonPrimary {...args}>
    Primary button
  </ButtonPrimary>

const TemplateOutline: Story<ButtonProps> = (args) =>
  <ButtonOutline {...args}>
    Outline button
  </ButtonOutline>

export const Primary = TemplatePrimary.bind({})
Primary.args = {
  disabled: false,
  large: false
}

export const Outline = TemplateOutline.bind({})
Outline.args = {
  disabled: false,
  large: false
}
