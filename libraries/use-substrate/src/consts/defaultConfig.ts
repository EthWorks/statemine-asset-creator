import { KUSAMA_ARCHIVE_NODE_URL } from './nodeUrls'
import type { Config } from '../providers'
import { Nodes } from './nodes'

export const DEFAULT_CONFIG: Config = {
  chains: [{ name: Nodes.Kusama, url: KUSAMA_ARCHIVE_NODE_URL }],
}
