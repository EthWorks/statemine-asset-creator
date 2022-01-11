import type { Codec, DetectCodec } from '@polkadot/types/types'

import { ApiRx, WsProvider } from '@polkadot/api'
import { TypeRegistry } from '@polkadot/types'

const KUSAMA_SS58_FORMAT = 2
let kusamaApiRx: ApiRx

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const kusamaCreateType = (type: string, params: unknown): DetectCodec<Codec, any> => {
  if (!kusamaApiRx) {
    const registry = new TypeRegistry()

    const ss58Format = registry.createType('u32', KUSAMA_SS58_FORMAT)
    registry.setChainProperties(registry.createType('ChainProperties', { ss58Format }))

    kusamaApiRx = new ApiRx({ provider: new WsProvider('ws://', false), registry })
  }

  return kusamaApiRx.createType(type, params)
}
