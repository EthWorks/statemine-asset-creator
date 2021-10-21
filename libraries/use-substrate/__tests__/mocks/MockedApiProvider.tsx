import React from 'react'
import { ALICE, ApiContext, UseApi } from '../../src'
import { from, ObservableInput } from 'rxjs'
import { DeriveBalancesAll, DeriveBalancesAllAccountData } from '@polkadot/api-derive/types'
import { createType } from '../utils/createType'
import BN from 'bn.js'
import { ApiRx } from '@polkadot/api'

export function MockedApiProvider(props: { children: React.ReactNode }) {
  const mockedKusamaApi: UseApi = {
    isConnected: true,
    api: {
      derive: {
        balances: {
          all: () => from<ObservableInput<DeriveBalancesAll>>([{
            additional: [] as DeriveBalancesAllAccountData[],
            availableBalance: createType('Balance', new BN(0)),
            lockedBalance: createType('Balance', new BN(0)),
            accountId: createType('AccountId', ALICE),
            accountNonce: createType('Index', 3),
            freeBalance: createType('Balance', new BN(10000)),
            frozenFee: createType('Balance', new BN(0)),
            frozenMisc: createType('Balance', new BN(0)),
            isVesting: false,
            lockedBreakdown: createType('Balance', new BN(0)),
            reservedBalance: createType('Balance', new BN(0)),
            vestedBalance: createType('Balance', new BN(0)),
            vestedClaimable: createType('Balance', new BN(0)),
            vestingEndBlock: createType('BlockNumber', 1234),
            vestingLocked: createType('Balance', new BN(0)),
            vestingPerBlock: createType('Balance', new BN(0)),
            vestingTotal: createType('Balance', new BN(0)),
            votingBalance: createType('Balance', new BN(0)),
          }])
        }
      }
    } as unknown as ApiRx,
    connectionState: 'connected',
  }

  const mockedStatmineApi: UseApi = {
    api: undefined,
    isConnected: false,
    connectionState: 'connecting',
  }

  return (
    <ApiContext.Provider value={{ 'kusama': mockedKusamaApi, 'statemine': mockedStatmineApi }}>
      {props.children}
    </ApiContext.Provider>
  )
}
