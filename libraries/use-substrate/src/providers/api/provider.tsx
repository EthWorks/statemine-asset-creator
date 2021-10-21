import React from 'react'
import { ApiContext } from './context'
import { useChainApi } from './useChainApi'
import { DEFAULT_CONFIG, defaultChainUrls } from '../../consts'
import { ChainInfo } from '../config'
import { initializeApi } from './initializeApi'

interface Props {
  chains: ChainInfo[]
}

const defaultChain = DEFAULT_CONFIG.chains[0]

export const ApiContextProvider: React.FC<Props> = ({ children, chains }): JSX.Element | null => {
  const chainsApis = chains.length
    ? initializeApi(chains)
    : { [defaultChain.name]: useChainApi(defaultChainUrls[defaultChain.name]) }

  return <ApiContext.Provider value={chainsApis}>{children}</ApiContext.Provider>
}
