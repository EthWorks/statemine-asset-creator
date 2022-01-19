import type { ObservableInput } from 'rxjs'
import type { ApiRx } from '@polkadot/api'
import type { DeriveBalancesAll, DeriveBalancesAllAccountData } from '@polkadot/api-derive/types'
import type { GenericEventData, Vec } from '@polkadot/types'
import type { BlockNumber, EventRecord, Hash, ParaId } from '@polkadot/types/interfaces'
import type { PalletAssetsAssetMetadata } from '@polkadot/types/lookup'
import type { AnyTuple, IEvent, ISubmittableResult } from '@polkadot/types/types'
import type { FetchedAssets, UseApi } from '../../src'

import BN from 'bn.js'
import React from 'react'
import { from, of } from 'rxjs'

import { createType } from 'test-helpers'

import { ApiContext, isModuleEvent } from '../../src'
import { ALICE, BOB } from '../consts'
import { createAssetStorageKey } from '../utils'

export const mockedKusamaApi: UseApi = {
  isConnected: true,
  api: {
    createType: createType,
    consts: {
      assets: {
        stringLimit: createType('u32', new BN(50)),
        assetDeposit: createType('u128', new BN(100)),
        metadataDepositBase: createType('u128', new BN(100)),
        metadataDepositPerByte: createType('u128', new BN(10))
      },
      balances: {
        existentialDeposit: createType('u128', new BN(120))
      }
    },
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
          vesting: []
        }])
      },
      chain: {
        bestNumber: () => from<ObservableInput<BlockNumber>>([createType('BlockNumber', new BN('966'))])
      }
    },
    events: {
      assets: {
        Created: { is: (arg: IEvent<AnyTuple>) => isModuleEvent(arg, 'assets', 'Created') },
        Destroyed: { is: (arg: IEvent<AnyTuple>) => isModuleEvent(arg, 'assets', 'Destroyed') }
      }
    },
    query: {
      parachainInfo: {
        parachainId: () => from<ObservableInput<ParaId>>([createType('ParaId', new BN('12'))])
      },
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
              [createAssetStorageKey(15), createType('Option<AssetDetails>', { owner: createType('AccountId', BOB), isSufficient: undefined })],
              [createAssetStorageKey(24), createType('Option<AssetDetails>', { owner: createType('AccountId', ALICE), isSufficient: true })],
              [createAssetStorageKey(1000), createType('Option<AssetDetails>', { owner: createType('AccountId', BOB) })]
            ]
          ])
        }
      },
      system: {
        events: () => from<ObservableInput<Vec<EventRecord>>>([
          Object.assign([{
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
    },
    tx: {
      balances: {
        transfer: () => ({
          paymentInfo: () => of(createType('RuntimeDispatchInfo', {
            weight: 6,
            partialFee: new BN(3)
          }))
        })
      },
      xcmPallet: {
        teleportAssets: jest.fn().mockReturnValue({
          paymentInfo: () => of(createType('RuntimeDispatchInfo', {
            weight: 6,
            partialFee: new BN(3000)
          })),
          signAndSend: () => from<ObservableInput<ISubmittableResult>>([])
        })
      }
    },
    registry: {
      chainDecimals: [18],
      chainTokens: ['TT']
    }
  } as unknown as ApiRx,
  connectionState: 'connected'
}

export function MockedApiProvider({ children, customApi }: { children: React.ReactNode, customApi?: UseApi }) {
  const mockedStatemineApi: UseApi = {
    api: undefined,
    isConnected: false,
    connectionState: 'connecting'
  }

  return (
    <ApiContext.Provider value={{ kusama: customApi ?? mockedKusamaApi, statemine: mockedStatemineApi }}>
      {children}
    </ApiContext.Provider>
  )
}

export const mockedRelayChainApi: UseApi = {
  ...mockedKusamaApi,
  api: {
    ...mockedKusamaApi.api,
    query: {
      ...mockedKusamaApi.api?.query,
      parachainInfo: undefined
    }
  } as unknown as ApiRx,
  isConnected: true,
  connectionState: 'connected'
}
