import type { AugmentedEvent } from '@polkadot/api/types'
import type { Vec } from '@polkadot/types'
import type { EventRecord } from '@polkadot/types/interfaces'

import { useEffect } from 'react'

import { Chains } from '../consts'
import { useChainDependentState } from '../util'
import { useApi } from './useApi'
import { useObservable } from './useObservable'

interface UseChainEvents { blockHash: string; events: EventRecord[]; }
type EventCheck = AugmentedEvent<'promise'> | false | undefined | null;

export function useChainEvents(chain: Chains, checks: EventCheck[]): UseChainEvents | undefined {
  const { currentChain, state, setState } = useChainDependentState<UseChainEvents>(chain)
  const { api } = useApi(currentChain)

  const eventRecords = useObservable<Vec<EventRecord>>(api?.query.system.events(), [api])
  console.log('createdAtHash', eventRecords?.createdAtHash)
  eventRecords?.forEach((event, index) => {
    console.log('---------------------')
    console.log(`event.[${index}].event`, event.event.toString())
    console.log(`event.[${index}].createdAtHash`, event.createdAtHash?.toString())
    console.log(`event.[${index}].phase`, event.phase.toString())
    console.log(`event.[${index}].topics`, event.topics.toString())
  })

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
