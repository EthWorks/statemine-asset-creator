// import { KUSAMA_GENESIS } from '../constants'

// 4 * BaseXcmWeight on Kusama
const KUSAMA_WEIGHT = 4 * 1_000_000_000

const DEFAULT_WEIGHT = KUSAMA_WEIGHT

// const KNOWN_WEIGHTS: Record<string, number> = {
//   [KUSAMA_GENESIS]: KUSAMA_WEIGHT
// }

// export function getTeleportWeight(api: ApiRx): number {
// return KNOWN_WEIGHTS[api.genesisHash.toHex()] || DEFAULT_WEIGHT
export function getTeleportWeight(): number {
  return DEFAULT_WEIGHT
}
