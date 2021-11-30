
import { Story } from '@storybook/react'

import { Loader, LoaderProps } from './index'

const Default = {
  title: 'Components/Loader',
  component: Loader,
  argTypes: {
    fullPage: {
      control: { type: 'boolean' }
    }
  }
}

export default Default

const Template: Story<LoaderProps> = (args) =>
  <Loader {...args} />

export const Base = Template.bind({})
Base.args = { fullPage: false }
