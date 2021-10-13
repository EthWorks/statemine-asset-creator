import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { DeriveBalancesAll, DeriveBalancesAllAccountData } from '@polkadot/api-derive/types'
import { Codec, DetectCodec } from '@polkadot/types/types'
import { ApiRx } from '@polkadot/api'
import { from, ObservableInput } from 'rxjs'
import BN from 'bn.js'
import { ALICE, ApiContext, UseApi, useBalances } from '../src'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createType = ( type: string, params: unknown): DetectCodec<Codec, any>  =>  new ApiRx().createType(type, params)

function MockedApiProvider(props: { children: React.ReactNode }) {
  const mockedValue: UseApi = {
    isConnected: true,
    api: {
      derive: {
        balances: {
          all: () => from<ObservableInput<DeriveBalancesAll>>([{
            additional: [] as DeriveBalancesAllAccountData[],
            availableBalance: createType('Balance',  new BN(0)),
            lockedBalance: createType('Balance',  new BN(0)),
            accountId: createType('AccountId', ALICE),
            accountNonce: createType('Index', 3),
            freeBalance: createType('Balance',  new BN(10000)),
            frozenFee: createType('Balance',  new BN(0)),
            frozenMisc: createType('Balance',  new BN(0)),
            isVesting: false,
            lockedBreakdown:  createType('Balance',  new BN(0)),
            reservedBalance: createType('Balance',  new BN(0)),
            vestedBalance: createType('Balance',  new BN(0)),
            vestedClaimable:createType('Balance',  new BN(0)),
            vestingEndBlock: createType('BlockNumber', 1234),
            vestingLocked: createType('Balance',  new BN(0)),
            vestingPerBlock:createType('Balance',  new BN(0)),
            vestingTotal: createType('Balance',  new BN(0)),
            votingBalance: createType('Balance',  new BN(0)),
          }])
        }
      }
    } as unknown as ApiRx,
    connectionState: 'connected',
  }

  return (
    <ApiContext.Provider value={mockedValue}>
      {props.children}
    </ApiContext.Provider>
  )
}

describe('useBalances hook', () => {
  it('returns balances', async () => {
    const { result } = renderResult()
    const { freeBalance, accountNonce } = result.current || {}

    expect(freeBalance?.toString()).toEqual('10000')
    expect(accountNonce?.toString()).toEqual('3')
  })

  const renderResult = () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedApiProvider>
        {children}
      </MockedApiProvider>
    )

    return renderHook(() => useBalances(ALICE), { wrapper })
  }
})
