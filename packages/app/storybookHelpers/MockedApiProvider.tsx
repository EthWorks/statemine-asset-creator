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
            availableBalance: new BN('100'),
            freeBalance: new BN('2'),
            reservedBalance: new BN('2')
          }])
        }
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
