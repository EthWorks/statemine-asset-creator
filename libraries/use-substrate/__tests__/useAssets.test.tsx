import type { ObservableInput } from 'rxjs'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { UseApi } from '../src'

import { ApiRx } from '@polkadot/api'
import { AccountId } from '@polkadot/types/interfaces'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { from } from 'rxjs'

import { Chains, useAssets } from '../src'
import { ALICE_ID, BOB, BOB_ID, } from './consts/addresses'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'
import { createType } from './utils/createType'

describe('Use assets hook', () => {
  it('Returns all available assets', async () => {
    const { result } = renderResult({ customApi })

    expect(result.current).toHaveLength(3)

    const { id: firstId, owner: firstOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[0]
    const { id: secondId, owner: secondOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[1]
    const { id: thirdId, owner: thirdOwner } = (result.current ?? [{ id: undefined, owner: undefined }])[2]

    expect(firstId?.toString()).toEqual('15')
    expect(firstOwner).toEqual(BOB_ID)
    expect(secondId?.toString()).toEqual('24')
    expect(secondOwner).toEqual(ALICE_ID)
    expect(thirdId?.toString()).toEqual('1000')
    expect(thirdOwner).toEqual(BOB_ID)
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
    const { result } = renderResult({ owner: createType('AccountId', BOB) })

    expect(result.current).toHaveLength(2)

    const { id, name, symbol, decimals, owner } = (result.current ?? [{ name: undefined, symbol: undefined, decimals: undefined }])[0]

    expect(id?.toString()).toEqual('15')
    expect(owner).toEqual(BOB_ID)
    expect(name).toEqual('TestToken')
    expect(symbol).toEqual('TT')
    expect(decimals).toEqual(8)
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
      ...mockedKusamaApi.api!.query,
      assets: {
        ...mockedKusamaApi.api!.query.assets,
        metadata: {
          multi:  () => from<ObservableInput<PalletAssetsAssetMetadata[]>>([
            [
              createType('AssetMetadata', { decimals: 8, symbol: 'TT', name: 'TestToken' }),
              createType('AssetMetadata', { decimals: 10, symbol: 'TTx', name: 'TestTokenExtra' }),
              createType('AssetMetadata', { decimals: 12, symbol: 'KSM', name: 'Kusama' })
            ]
          ])
        }
      }
    }
  } as unknown as ApiRx,
}
