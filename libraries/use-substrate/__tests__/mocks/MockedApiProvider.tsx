import type { ObservableInput } from 'rxjs'
import type { DeriveBalancesAll, DeriveBalancesAllAccountData } from '@polkadot/api-derive/types'
import type { FetchedAssets, UseApi } from '../../src'

import { ApiRx } from '@polkadot/api'
import { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import BN from 'bn.js'
import React from 'react'
import { from, of } from 'rxjs'

import { ALICE, ApiContext, BOB } from '../../src'
import { createType } from '../utils/createType'

export const mockedKusamaApi: UseApi = {
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
          vestingLocked: createType('Balance', new BN(0)),
          vestingTotal: createType('Balance', new BN(0)),
          votingBalance: createType('Balance', new BN(0)),
          vesting: [],
        }])
      }
    },
    query: {
      assets: {
        metadata: {
          multi: () => from<ObservableInput<PalletAssetsAssetMetadata[]>>([
            [
              createType('AssetMetadata', { decimals: 8, symbol: 'TT', name: 'TestToken' }),
              createType('AssetMetadata', { decimals: 12, symbol: 'KSM', name: 'Kusama' })
            ]
          ])
        },
        asset: {
          entries: () => from<ObservableInput<FetchedAssets>>([
            [
              [createType('AssetId', new BN(15)), createType('AssetDetails', { owner: createType('AccountId', BOB) })],
              [createType('AssetId', new BN(24)), createType('AssetDetails', { owner: createType('AccountId', ALICE) })],
              [createType('AssetId', new BN(37)), createType('AssetDetails', { owner: createType('AccountId', BOB) })]
            ]
          ])
        }
      }
    },
    tx: {
      balances: {
        transfer: () => ({
          paymentInfo: () => of(createType('RuntimeDispatchInfo', {
            weight: 6,
            partialFee: new BN(3)
          }))
        })
      }
    }
  } as unknown as ApiRx,
  connectionState: 'connected',
}

export function MockedApiProvider({ children, customApi }: { children: React.ReactNode, customApi?: UseApi }) {
  const mockedStatemineApi: UseApi = {
    api: undefined,
    isConnected: false,
    connectionState: 'connecting',
  }

  return (
    <ApiContext.Provider value={{ 'kusama': customApi ? customApi : mockedKusamaApi, 'statemine': mockedStatemineApi }}>
      {children}
    </ApiContext.Provider>
  )
}
