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
            availableBalance: '100',
            freeBalance: '2',
          }])
        }
      }
    },
    connectionState: 'connected',
  } as unknown as APIConnected

  return (
    <ApiContext.Provider value={{ 'kusama': mockedKusamaApi }}>
      {props.children}
    </ApiContext.Provider>
  )
}
