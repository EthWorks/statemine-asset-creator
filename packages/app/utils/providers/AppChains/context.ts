import { createContext } from 'react'

import { Chains } from 'use-substrate'

export interface UseAppChains {
  relayChain: Chains,
  setRelayChain: (chain: Chains) => void,
  paraChain: Chains
  setParaChain: (chain: Chains) => void,
}

export const noop = (): void => { /**/ }

const defaultValue: UseAppChains = {
  relayChain: Chains.Kusama,
  setRelayChain: noop,
  paraChain: Chains.Statemine,
  setParaChain: noop
}

export const AppChainsContext = createContext<UseAppChains>(defaultValue)
