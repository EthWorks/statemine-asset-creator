import { useContext } from 'react'

import { AppChainsContext, UseAppChains } from '../providers'

export function useAppChains(): UseAppChains {
  return useContext(AppChainsContext)
}
