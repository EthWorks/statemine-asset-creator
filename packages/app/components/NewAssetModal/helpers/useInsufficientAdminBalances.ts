import type { Balance } from '@polkadot/types/interfaces'
import type { Account } from 'use-substrate'

import BN from 'bn.js'

import { useBalances } from 'use-substrate'

import { useAppChains } from '../../../utils'

type AdminAccount = 'Admin' | 'Issuer' | 'Freezer'

// to be changed based on chains decimals
const EXPECTED_BALANCE = new BN('1000000000')

export function useInsufficientAdminBalances(admin: Account | undefined, issuer: Account | undefined, freezer: Account | undefined): AdminAccount[] {
  const { paraChain } = useAppChains()
  const { availableBalance: adminsAvailableBalance } = useBalances(admin?.address, paraChain) || {}
  const { availableBalance: issuersAvailableBalance } = useBalances(issuer?.address, paraChain) || {}
  const { availableBalance: freezersAvailableBalance } = useBalances(freezer?.address, paraChain) || {}

  const adminBalances: [Balance | undefined, AdminAccount][] = [[adminsAvailableBalance, 'Admin'], [issuersAvailableBalance, 'Issuer'], [freezersAvailableBalance, 'Freezer']]

  return adminBalances.flatMap(([balance, role]) => {
    return balance?.lt(EXPECTED_BALANCE) ? role : []
  })
}
