import type { Config } from '../providers'

import { Chains } from './chains'
import { KUSAMA_ARCHIVE_NODE_URL } from './defaultChainUrls'

export const DEFAULT_CONFIG: Config = {
  chains: [{ name: Chains.Kusama, url: KUSAMA_ARCHIVE_NODE_URL }],
  appName: 'useSubstrate Application'
}
