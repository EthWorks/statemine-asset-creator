import type { ChainInfo } from '../config'
import type { UseApi } from './types'

import { Chains, defaultChainUrls } from '../../consts'
import { useChainApi } from './useChainApi'

export function initializeApi(chainInfos: ChainInfo[]): Partial<Record<Chains, UseApi>> {
  return chainInfos.reduce(
    (o, { name, url }) => Object.assign(o, { [name]: useChainApi(url || defaultChainUrls[name]) }),
    {}
  )
}
