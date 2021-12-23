import BN from 'bn.js'
import React from 'react'
import { from } from 'rxjs'

import { APIConnected, ApiContext } from 'use-substrate'

export function MockedApiProvider(props: { children: React.ReactNode }): JSX.Element {
  const mockedKusamaApi = {
    isConnected: true,
    api: {
      derive: {
        balances: {
          all: () => from([{
            availableBalance: new BN(4000000000000000),
            freeBalance: new BN(6000000000000000),
            lockedBalance: 300,
            reservedBalance: new BN(100000000000000),
            accountNonce: 1
          }])
        }
      },
      registry: {
        chainDecimals: [12],
        chainTokens: ['TT']
      }
    },
    connectionState: 'connected'
  } as unknown as APIConnected

  return (
    <ApiContext.Provider value={{ kusama: mockedKusamaApi }}>
      {props.children}
    </ApiContext.Provider>
  )
}
