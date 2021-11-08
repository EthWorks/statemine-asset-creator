import { Story } from '@storybook/react'

import { Title } from '../typography'
import { SectionTitle, SectionTitleProps } from './SectionTitle'

const Default = {
  title: 'Components/SectionTitle',
  component: SectionTitle,
  parameters: {
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: '#000000' },
      ],
    },
  },
}

export default Default

const Template: Story<SectionTitleProps> = (args) =>
  <SectionTitle {...args}>
    <Title>Example Section Title</Title>
  </SectionTitle>

export const Base = Template.bind({})
Base.args = {}
