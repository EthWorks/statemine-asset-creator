import { Story } from '@storybook/react'

import { ButtonOutline, ButtonPrimary, ButtonProps } from './Button'

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
  large: false,
}

export const Outline = TemplateOutline.bind({})
Outline.args = {
  large: false,
}
