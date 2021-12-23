import type { Story } from '@storybook/react'
import type { CookiesBarProps } from './index'

import { CookiesBar } from './index'

const Default = {
  title: 'Components/CookiesBar',
  component: CookiesBar,
  parameters: {
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: 'rgba(0,0,0,0.5)' }
      ]
    }
  }
}

export default Default

const Template: Story<CookiesBarProps> = (args) =>
  <CookiesBar {...args} />

export const Base = Template.bind({})
Base.args = {
  text: 'We use third party cookies in order to personalize your site experience.'
}
