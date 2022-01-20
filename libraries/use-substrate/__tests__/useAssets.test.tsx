import type { ObservableInput } from 'rxjs'
import type { AccountId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { UseApi } from '../src'

import { ApiRx } from '@polkadot/api'
import { Vec } from '@polkadot/types'
import { EventRecord } from '@polkadot/types/interfaces'
import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { asyncScheduler, from, observeOn } from 'rxjs'

import { createType } from 'test-helpers'

import { Chains, useAssets } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'
import { EVENT_HASH, mockedEvents } from './mocks/mockedEvents'
import { ALICE, ALICE_ID, BOB, BOB_ID } from './consts'
import { createAssetStorageKey } from './utils'

describe('Use assets hook', () => {
  it('Returns all available assets', async () => {
    const { result } = renderResult({ customApi })

    expect(result.current).toHaveLength(3)

    const { id: firstId, owner: firstOwner, isSufficient: firstIsSufficient } = (result.current ?? [{ id: undefined, owner: undefined }])[0]
    const { id: secondId, owner: secondOwner, isSufficient: secondIsSufficient } = (result.current ?? [{ id: undefined, owner: undefined }])[1]
    const { id: thirdId, owner: thirdOwner, isSufficient: thirdIsSufficient } = (result.current ?? [{ id: undefined, owner: undefined }])[2]

    expect(firstId?.toString()).toEqual('15')
    expect(firstOwner).toEqual(BOB_ID)
    expect(firstIsSufficient).toEqual(false)
    expect(secondId?.toString()).toEqual('24')
    expect(secondOwner).toEqual(ALICE_ID)
    expect(secondIsSufficient).toEqual(true)
    expect(thirdId?.toString()).toEqual('1000')
    expect(thirdOwner).toEqual(BOB_ID)
    expect(thirdIsSufficient).toEqual(false)
  })

  it('Returns owners assets', () => {
    const { result } = renderResult({ owner: BOB_ID })

    expect(result.current).toHaveLength(2)

    const { id: firstId, owner: firstOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[0]
    const { id: secondId, owner: secondOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[1]

    expect(firstId?.toString()).toEqual('15')
    expect(firstOwner).toEqual(BOB_ID)
    expect(secondId?.toString()).toEqual('1000')
    expect(secondOwner).toEqual(BOB_ID)
  })

  it('Returns asset details', () => {
    const { result } = renderResult({ owner: BOB_ID })

    expect(result.current).toHaveLength(2)

    const { id, name, symbol, decimals, owner } = (result.current ?? [{ name: undefined, symbol: undefined, decimals: undefined }])[0]

    expect(id?.toString()).toEqual('15')
    expect(owner).toEqual(BOB_ID)
    expect(name).toEqual('TestToken')
    expect(symbol).toEqual('TT')
    expect(decimals).toEqual(8)
  })

  it('Converts name and symbol to utf8', async () => {
    const { result } = renderResult({ customApi })

    const { name, symbol } = (result.current ?? [])[2]

    expect(name).toEqual('Kusama😒')
    expect(symbol).toEqual('KSM🤪')
  })

  describe('observes on events', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
      jest.resetAllMocks()
    })

    it('updates after Created asset event', async () => {
      const api = createEventApi([mockedEvents.assets.Created])

      renderResult({ customApi: api })

      expect(api.api?.query.assets.asset.entries).toBeCalled()
      expect(api.api?.query.assets.asset.entriesAt).toBeCalledTimes(0)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(api.api?.query.assets.asset.entriesAt).toBeCalledTimes(1)
      expect(api.api?.query.assets.asset.entriesAt).toBeCalledWith(EVENT_HASH.toString())
    })

    it('updates after Destroyed asset event', async () => {
      const api = createEventApi([mockedEvents.assets.Destroyed])

      renderResult({ customApi: api })

      expect(api.api?.query.assets.asset.entries).toBeCalled()
      expect(api.api?.query.assets.asset.entriesAt).toBeCalledTimes(0)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(api.api?.query.assets.asset.entriesAt).toBeCalledTimes(1)
      expect(api.api?.query.assets.asset.entriesAt).toBeCalledWith(EVENT_HASH.toString())
    })

    it('not updates after unsupported events', async () => {
      const api = createEventApi([mockedEvents.assets.Transferred])

      renderResult({ customApi: api })

      expect(api.api?.query.assets.asset.entries).toBeCalled()
      expect(api.api?.query.assets.asset.entriesAt).not.toBeCalled()

      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(api.api?.query.assets.asset.entriesAt).not.toBeCalled()
    })
  })

  const renderResult = ({ owner, customApi }:{owner?: AccountId, customApi?: UseApi}) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider customApi={customApi}>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useAssets(Chains.Kusama, { owner }), { wrapper })
  }
})

const customApi: UseApi = {
  isConnected: true,
  connectionState: 'connected',
  api: {
    ...mockedKusamaApi.api,
    query: {
      ...mockedKusamaApi.api?.query,
      assets: {
        ...mockedKusamaApi.api?.query.assets,
        metadata: {
          multi: () => from<ObservableInput<PalletAssetsAssetMetadata[]>>([
            [
              createType('AssetMetadata', { decimals: 8, symbol: 'TT', name: 'TestToken' }),
              createType('AssetMetadata', { decimals: 10, symbol: 'TTx', name: 'TestTokenExtra' }),
              createType('AssetMetadata', { decimals: 12, symbol: 'KSM🤪', name: 'Kusama😒' })
            ]
          ])
        }
      }
    }
  } as unknown as ApiRx
}

function createEventApi(events: EventRecord[]): UseApi {
  return {
    isConnected: true,
    connectionState: 'connected',
    api: {
      ...mockedKusamaApi.api,
      query: {
        ...mockedKusamaApi.api?.query,
        system: {
          ...mockedKusamaApi.api?.query.system,
          events: () => from<ObservableInput<Vec<EventRecord>>>([
            [] as unknown as Vec<EventRecord>,
            Object.assign([
              ...events
            ] as Vec<EventRecord>, { createdAtHash: EVENT_HASH })
          ]).pipe(observeOn(asyncScheduler, 100))
        },
        assets: {
          ...mockedKusamaApi.api?.query.assets,
          metadata: {
            multi: () => from<ObservableInput<PalletAssetsAssetMetadata[]>>([
              [
                createType('AssetMetadata', { decimals: 8, symbol: 'TT', name: 'TestToken' }),
                createType('AssetMetadata', { decimals: 10, symbol: 'TTx', name: 'TestTokenExtra' }),
                createType('AssetMetadata', { decimals: 12, symbol: 'KSM🤪', name: 'Kusama😒' })
              ]
            ])
          },
          asset: {
            entries: jest.fn().mockReturnValue(
              Object.assign([
                [createAssetStorageKey(15), createType('Option<AssetDetails>', { owner: createType('AccountId', BOB), isSufficient: undefined })],
                [createAssetStorageKey(24), createType('Option<AssetDetails>', { owner: createType('AccountId', ALICE), isSufficient: true })],
                [createAssetStorageKey(24), createType('Option<AssetDetails>', { owner: createType('AccountId', ALICE), isSufficient: true })]
              ], { subscribe: () => { /* noop */ } })
            ),
            entriesAt: jest.fn().mockReturnValue(
              Object.assign([
                [createAssetStorageKey(15), createType('Option<AssetDetails>', { owner: createType('AccountId', BOB), isSufficient: undefined })],
                [createAssetStorageKey(24), createType('Option<AssetDetails>', { owner: createType('AccountId', ALICE), isSufficient: true })],
                [createAssetStorageKey(24), createType('Option<AssetDetails>', { owner: createType('AccountId', ALICE), isSufficient: true })]
              ], { subscribe: () => { /* noop */ } })
            )
          }
        }
      }
    } as unknown as ApiRx
  }
}
