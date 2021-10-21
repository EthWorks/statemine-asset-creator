import type { ChainInfo } from '../config'
import { useChainApi } from './useChainApi'
import { defaultChainUrls, Chains } from '../../consts'
import type { UseApi } from './types'

export function initializeApi(chainInfos: ChainInfo[]): Partial<Record<Chains, UseApi>> {
  return chainInfos.reduce(
    (o, { name, url }) => Object.assign(o, { [name]: useChainApi(url ? url : defaultChainUrls[name]) }),
    {}
  )
}
