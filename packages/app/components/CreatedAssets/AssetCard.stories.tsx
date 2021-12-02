import type { Story } from '@storybook/react'
import type { AssetCardProps } from './AssetCard'

import { mockUseAssets } from '../../__tests__/mocks/mockUseAssets'
import { AssetCard } from './AssetCard'

const Default = {
  title: 'Components/AssetCard',
  component: AssetCard
}

export default Default

const Template: Story<AssetCardProps> = (args) =>
  <AssetCard {...args} />

export const Base = Template.bind({})
Base.args = {
  asset: mockUseAssets[0]
}
