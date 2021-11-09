import { useContext } from 'react'

import { ActiveAccountContext, UseActiveAccount } from '../providers'

export function useActiveAccount(): UseActiveAccount {
  return useContext(ActiveAccountContext)
}
