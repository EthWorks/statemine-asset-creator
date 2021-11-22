import type { UseActiveAccount } from '../providers'

import { useContext } from 'react'

import { ActiveAccountContext } from '../providers'

export function useActiveAccount(): UseActiveAccount {
  return useContext(ActiveAccountContext)
}
