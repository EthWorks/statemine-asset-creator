import type { AugmentedEvent } from '@polkadot/api/types'
import type { Vec } from '@polkadot/types'
import type { EventRecord } from '@polkadot/types/interfaces'

import { useEffect, useState } from 'react'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

interface UseChainEvents { blockHash: string; events: EventRecord[]; }
type EventCheck = AugmentedEvent<'promise'> | false | undefined | null;

export function useChainEvents(chain: Chains, checks: EventCheck[]): UseChainEvents | undefined {
  const [state, setState] = useState<UseChainEvents>()
  const { api } = useApi(chain)

  const eventRecords = useObservable<Vec<EventRecord>>(api?.query.system.events(), [api])

  useEffect((): void => {
    if (eventRecords) {
      const events = eventRecords.filter((record) =>
        record.event &&
          checks.some((check) => check && check.is(record.event))
      )

      if (events.length) {
        setState({
          blockHash: eventRecords.createdAtHash?.toHex() || '',
          events
        })
      }
    }
  }, [eventRecords, checks])

  return state
}
