import type { ObservableInput } from 'rxjs'
import type { AccountId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { UseApi } from '../src'

import { ApiRx } from '@polkadot/api'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { from } from 'rxjs'
import { createType } from 'test-helpers'

import { Chains, useAssets } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'
import { ALICE_ID, BOB_ID } from './consts'

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
