import { KUSAMA_ARCHIVE_NODE_URL } from './nodeUrls'
import type { Config } from '../providers'

export const DEFAULT_CONFIG: Config = {
  chains: [{ chain: 'kusama', url: KUSAMA_ARCHIVE_NODE_URL }],
}


