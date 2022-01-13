import { createContext } from 'react'

import { Chains } from 'use-substrate'

export interface UseAppChains {
  relayChain: Chains,
  setRelayChain: (chain: Chains) => void,
  parachain: Chains
  setParachain: (chain: Chains) => void,
}

export const noop = (): void => { /**/ }

const defaultValue: UseAppChains = {
  relayChain: Chains.Kusama,
  setRelayChain: noop,
  parachain: Chains.Statemine,
  setParachain: noop
}

export const AppChainsContext = createContext<UseAppChains>(defaultValue)
