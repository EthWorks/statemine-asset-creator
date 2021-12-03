import type { Account } from '../../providers'

import { BOB } from '../../../__tests__/consts/addresses'

export const useAccounts = (): { allAccounts: Account[] } => ({
  allAccounts: [{ name: 'bob', address: BOB }]
})
