import React, { useState } from 'react'

import { Chains } from 'use-substrate'

import { AppChainsContext } from './context'

export const AppChainsProvider: React.FC = ({ children }): JSX.Element | null => {
  const [relayChain, setRelayChain] = useState<Chains>(Chains.Kusama)
  const [paraChain, setParaChain] = useState<Chains>(Chains.Statemine)

  return <AppChainsContext.Provider value={{ relayChain, setRelayChain, paraChain, setParaChain }}>{children}</AppChainsContext.Provider>
}
