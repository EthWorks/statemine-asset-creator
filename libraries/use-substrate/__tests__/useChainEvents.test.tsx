import { ApiRx } from '@polkadot/api'
import { GenericEventData, Vec } from '@polkadot/types'
import { EventRecord, Hash } from '@polkadot/types/interfaces'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode, useMemo } from 'react'
import { from, ObservableInput } from 'rxjs'

import { createType } from 'test-helpers'

import { Chains, UseApi, useApi, useChainEvents } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'

describe('useChainEvents hook', () => {
  it('returns emitted events', () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.events[0].event.section).toEqual('assets')
    expect(result.current?.events[0].event.method).toEqual('Created')
  })

  it('returns emitted event block number', () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.blockHash).toEqual('0x38020a026d6f646c506f745374616b650038020a026d6f646c506f745374616b')
  })

  it('filters out events not passing checks', () => {
    const { result } = renderResult(Chains.Kusama)

    expect(result.current?.events).toHaveLength(1)
  })

  it('returns undefined if api is not connected', () => {
    const { result } = renderResult(Chains.Statemine)

    expect(result.current).toBeUndefined()
  })

  const renderResult = (chain: Chains) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider customApi={customApi as UseApi}>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => {
      const { api } = useApi(Chains.Kusama)
      const checks = useMemo(() => [api?.events.assets.Created], [api])

      return useChainEvents(chain, checks)
    }, { wrapper })
  }
})

const customApi = {
  ...mockedKusamaApi,
  api: {
    ...mockedKusamaApi.api,
    query: {
      ...mockedKusamaApi.api?.query,
      system: {
        ...mockedKusamaApi.api?.query.system,
        events: () => from<ObservableInput<Vec<EventRecord>>>([
          Object.assign([
            {
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
            {
              phase: { ApplyExtrinsic: 1 },
              event: {
                section: 'assets',
                method: 'Destroyed',
                index: createType('EventId', '0x0002'),
                data: [{ module: { index: 22, error: 1 } }, {
                  weight: 352153000,
                  class: 'Normal',
                  paysFee: 'Yes'
                }] as unknown as GenericEventData
              },
              topics: [] as unknown as Vec<Hash>
            } as unknown as EventRecord] as Vec<EventRecord>, {
            createdAtHash: createType('Hash', '0x38020a026d6f646c506f745374616b650038020a026d6f646c506f745374616b6500')
          })
        ])
      }
    }
  } as unknown as ApiRx
}
