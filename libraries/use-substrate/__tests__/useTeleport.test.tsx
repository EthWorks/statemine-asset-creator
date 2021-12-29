import type { AccountId } from '@polkadot/types/interfaces'
import type { TeleportInput, UseApi } from '../src'

import { renderHook } from '@testing-library/react-hooks'
import BN from 'bn.js'
import React, { ReactNode } from 'react'
import { createType } from 'test-helpers'

import { ApiContext, Chains, useTeleport } from '../src'
import { mockedKusamaApi, mockedRelayChainApi } from './mocks/MockedApiProvider'
import { mockExtensionDapp } from './mocks/mockExtensionDapp'
import { ALICE_ID, BOB_ID } from './consts'

const SENDER: TeleportInput = { account: ALICE_ID, chain: Chains.Kusama }
const RECIPIENT: TeleportInput = { account: BOB_ID, chain: Chains.Statemine }
const AMOUNT = new BN(100000)

describe('useTeleport hook calls teleport method from', () => {
  beforeEach(() => {
    jest.doMock('@polkadot/extension-dapp', () => mockExtensionDapp)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('parachain', async () => {
    renderResult(SENDER, RECIPIENT, AMOUNT)

    expect(mockedKusamaApi.api?.tx.xcmPallet.teleportAssets).toBeCalledWith(
      { V1: { parents: 1, interior: 'Here' } },
      { V1: { parents: 0, interior: { X1: { AccountId32: { id: (BOB_ID as AccountId).toHex(), network: 'Any' } } } } },
      { V1: [{ id: { Concrete: { parents: 0, interior: 'Here' } }, fun: { Fungible: AMOUNT } }] },
      0
    )
  })

  it('relaychain', async () => {
    renderResult(SENDER, RECIPIENT, AMOUNT, mockedRelayChainApi)

    expect(mockedKusamaApi.api?.tx.xcmPallet.teleportAssets).toBeCalledWith(
      { V1: { parents: 0, interior: { X1: { Parachain: createType('u32', new BN(12)) } } } },
      { V1: { parents: 0, interior: { X1: { AccountId32: { id: (BOB_ID as AccountId).toHex(), network: 'Any' } } } } },
      { V1: [{ id: { Concrete: { parents: 0, interior: 'Here' } }, fun: { Fungible: AMOUNT } }] },
      0
    )
  })

  const renderResult = (sender: TeleportInput, recipient: TeleportInput, amount: BN, customKusamaApi?: UseApi) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ApiContext.Provider value={{ kusama: customKusamaApi ?? mockedKusamaApi, statemine: mockedKusamaApi }}>
        {children}
      </ApiContext.Provider>
    )

    return renderHook(() => useTeleport(sender, recipient, amount), { wrapper })
  }
})
