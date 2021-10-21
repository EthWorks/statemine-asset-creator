import { KUSAMA_ARCHIVE_NODE_URL } from './defaultChainUrls'
import type { Config } from '../providers'
import { Chains } from './chains'

export const DEFAULT_CONFIG: Config = {
  chains: [{ name: Chains.Kusama, url: KUSAMA_ARCHIVE_NODE_URL }],
}
