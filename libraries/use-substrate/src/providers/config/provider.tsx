import React from 'react'
import { ConfigContext } from './context'
import { ConfigProviderProps } from './types'

export function ConfigProvider({ config, children }: ConfigProviderProps): JSX.Element {

  return <ConfigContext.Provider value={{ config }} children={children}/>
}
