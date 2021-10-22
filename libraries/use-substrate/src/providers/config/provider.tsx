import React from 'react'

import { ConfigContext } from './context'
import { ConfigProviderProps } from './types'

export const  ConfigProvider: React.FC<ConfigProviderProps> = ({ config, children }): JSX.Element => {

  return <ConfigContext.Provider value={{ config }} children={children}/>
}
