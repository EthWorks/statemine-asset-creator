import { GenericEventData, Vec } from '@polkadot/types'
import { EventRecord, Hash } from '@polkadot/types/interfaces'

import { createType } from 'test-helpers'

export const EVENT_HASH = createType('Hash', '0x38020a026d6f646c506f745374616b650038020a026d6f646c506f745374616b6500')

export const mockedEvents = {
  assets: {
    Destroyed: {
      phase: { ApplyExtrinsic: 1 },
      event: {
        section: 'assets',
        method: 'Destroyed',
        index: createType('EventId', '0x0001'),
        data: [{ module: { index: 34, error: 9 } }, {
          weight: 397453000,
          class: 'Normal',
          paysFee: 'Yes'
        }] as unknown as GenericEventData
      },
      topics: [] as unknown as Vec<Hash>
    } as unknown as EventRecord,
    Created: {
      phase: { ApplyExtrinsic: 1 },
      event: {
        section: 'assets',
        method: 'Created',
        index: createType('EventId', '0x0001'),
        data: [{ module: { index: 34, error: 9 } }, {
          weight: 397453000,
          class: 'Normal',
          paysFee: 'Yes'
        }] as unknown as GenericEventData
      },
      topics: [] as unknown as Vec<Hash>
    } as unknown as EventRecord,
    Transferred: {
      phase: { ApplyExtrinsic: 1 },
      event: {
        section: 'assets',
        method: 'Transferred',
        index: createType('EventId', '0x0003'),
        data: [{ module: { index: 3 } }, {
          weight: 397412300,
          class: 'Normal',
          paysFee: 'Yes'
        }] as unknown as GenericEventData
      },
      topics: [] as unknown as Vec<Hash>
    } as unknown as EventRecord
  }
}
