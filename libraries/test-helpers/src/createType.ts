import type { Codec, DetectCodec } from '@polkadot/types/types'

import { ApiRx, WsProvider } from '@polkadot/api'
import { Metadata, TypeRegistry } from '@polkadot/types'
import metaStatic from '@polkadot/types-support/metadata/static-substrate'

let apiRx: ApiRx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createType = (type: string, params: unknown, arg?: unknown): DetectCodec<Codec, any> => {
  if (!apiRx) {
    const registry = new TypeRegistry()
    const metadata = new Metadata(registry, metaStatic)

    registry.setMetadata(metadata)

    apiRx = new ApiRx({ provider: new WsProvider('ws://', false) })
    apiRx.injectMetadata(metadata, true, registry)
  }

  return apiRx.createType(type, params, arg)
}
