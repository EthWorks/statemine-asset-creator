import { ChainInfo } from '../config'
import { useChainApi } from './useChainApi'
import { mappedUrls, Nodes } from '../../consts'
import { UseApi } from './types'

export function initializeApi(chainInfos: ChainInfo[]): Partial<Record<Nodes, UseApi>> {
  return chainInfos.reduce(
    (o, { name, url }) => Object.assign(o, { [name]: useChainApi(url ? url : mappedUrls[name]) }),
    {}
  )
}
