import { ApiRx, WsProvider } from '@polkadot/api'
import { Metadata, TypeRegistry } from '@polkadot/types'
import metaStatic from '@polkadot/types-support/metadata/static-substrate'

export function createApiWithAugmentations(): ApiRx {
  const registry = new TypeRegistry()
  const metadata = new Metadata(registry, metaStatic)

  registry.setMetadata(metadata)

  const api = new ApiRx({ provider: new WsProvider('ws://', false), registry })

  api.injectMetadata(metadata, true, registry)

  return api
}
