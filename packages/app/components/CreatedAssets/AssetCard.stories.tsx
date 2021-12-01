import { Story } from '@storybook/react'

import { mockUseAssets } from '../../__tests__/mocks/mockUseAssets'
import { AssetCard, Props } from './AssetCard'

const Default = {
  title: 'Components/AssetCard',
  component: AssetCard,
  argTypes: {

  }
}

export default Default

const Template: Story<Props> = (args) =>
  <AssetCard {...args} />

export const Base = Template.bind({})
Base.args = {
  asset: mockUseAssets[0]
}
