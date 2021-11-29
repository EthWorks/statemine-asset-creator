import { Story } from '@storybook/react'

import { StyledCard } from '../../pages'
import { Text } from '../typography'
import { PageBox, PageBoxProps } from './index'

const Default = {
  title: 'Components/PageBox',
  component: PageBox,
  parameters: {
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: 'rgba(0,0,0,0.5)' }
      ]
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['large', 'full']
    }
  }
}

export default Default

const Template: Story<PageBoxProps> = (args) =>
  <PageBox {...args}>
    <StyledCard padding='s'>
      <Text size="SM" color="white">You haven’t created any assets yet.</Text>
      <Text size="SM">Here you can create fungible assets, which will be governed by you and accounts you designate.</Text>
    </StyledCard>
  </PageBox>

export const Base = Template.bind({})
Base.args = { size: 'large' }
