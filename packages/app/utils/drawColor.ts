import { AssetId } from '@polkadot/types/interfaces'

const COLORS_LIST = ['#E6007A', '#2DD4BF', '#3B82F6', '#E4C000']

export const drawColor = (id: AssetId): string => {
  const colorNumber = id.modn(COLORS_LIST.length)

  return COLORS_LIST[colorNumber]
}
