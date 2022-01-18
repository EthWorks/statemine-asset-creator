import { useEffect, useState } from 'react'

import { Chains } from '../consts'

interface UseChainDependentState<T> {
  currentChain: Chains,
  state: T | undefined,
  setState: (arg: T) => void,
}

export function useChainDependentState<T>(chain: Chains, initState?: T): UseChainDependentState<T> {
  const [currentChain, setCurrentChain] = useState<Chains>(chain)
  const [state, setState] = useState<T | undefined>(initState)

  useEffect(() => {
    setState(undefined)
    setCurrentChain(chain)
  }, [chain])

  return { currentChain, state, setState }
}
