import type { Story } from '@storybook/react'
import type { CookiesProps } from './index'

import { Cookies } from './index'

const Default = {
  title: 'Components/Cookies',
  component: Cookies,
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

const Template: Story<CookiesProps> = (args) =>
  <Cookies {...args} />

export const Base = Template.bind({})
Base.args = {
  text: 'We use third party cookies in order to personalize your site experience.'
}
