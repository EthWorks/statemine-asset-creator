import type { AccountId } from '@polkadot/types/interfaces'
import type { TeleportInput } from '../src'

import { renderHook } from '@testing-library/react-hooks'
import BN from 'bn.js'
import React, { ReactNode } from 'react'

import { Chains, useTeleport } from '../src'
import { MockedApiProvider, mockedKusamaApi } from './mocks/MockedApiProvider'
import { mockExtensionDapp } from './mocks/mockExtensionDapp'
import { ALICE_ID, BOB_ID } from './consts'

const SENDER: TeleportInput = { account: ALICE_ID, chain: Chains.Kusama }
const RECIPIENT: TeleportInput = { account: BOB_ID, chain: Chains.Statemine }
const AMOUNT = new BN(100000)

describe('useTeleport hook', () => {
  beforeAll(() => {
    jest.doMock('@polkadot/extension-dapp', () => mockExtensionDapp)
  })

  it('calls teleport method', async () => {
    renderResult(SENDER, RECIPIENT, AMOUNT)

    expect(mockedKusamaApi.api?.tx.xcmPallet.teleportAssets).toBeCalledWith(
      { X1: 'Parent' },
      { X1: { AccountId32: { id: (BOB_ID as AccountId).toHex(), network: 'Any' } } },
      [{ ConcreteFungible: { amount: AMOUNT, id: { X1: 'Parent' } } }],
      4000000000
    )
  })

  const renderResult = (sender: TeleportInput, recipient: TeleportInput, amount: BN) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useTeleport(sender, recipient, amount), { wrapper })
  }
})
