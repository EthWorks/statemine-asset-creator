import { Metadata, TypeRegistry } from '@polkadot/types'
import json1 from '@polkadot/types-support/json/EventRecord.001.json'
import json3 from '@polkadot/types-support/json/EventRecord.003.json'
import rpcMetadata from '@polkadot/types-support/metadata/static-substrate'

describe('EventRecord', (): void => {
  const registry = new TypeRegistry()

  describe('EventRecord (current)', (): void => {
    beforeEach((): void => {
      const metadata = new Metadata(registry, rpcMetadata)

      registry.setMetadata(metadata)
    })

    it('decodes older EventRecord correctly', (): void => {
      const records = registry.createType('Vec<EventRecord>', json1.params.result.changes[0][1], true)
      const er = records[0]

      expect(er.phase.type).toEqual('ApplyExtrinsic')
    })

    it('decodes EventRecord with topics correctly', (): void => {
      const hex = json3.params.result.changes[0][1]
      const records = registry.createType('Vec<EventRecord>', hex, true)
      const er = records[0]

      expect(er.phase.type).toEqual('ApplyExtrinsic')
      expect(records.toHex()).toEqual(hex)
    })
  })
})
