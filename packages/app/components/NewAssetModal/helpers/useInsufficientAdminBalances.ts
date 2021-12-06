import type { Balance } from '@polkadot/types/interfaces'
import type { Account } from 'use-substrate'

import BN from 'bn.js'

import { Chains, useBalances } from 'use-substrate'

type AdminAccount = 'Admin' | 'Issuer' | 'Freezer'

// to be changed based on chains decimals
const EXPECTED_BALANCE = new BN('1000000000')

export function useInsufficientAdminBalances(admin: Account | undefined, issuer: Account | undefined, freezer: Account | undefined): AdminAccount[] {
  const { availableBalance: adminsAvailableBalance } = useBalances(admin?.address, Chains.Statemine) || {}
  const { availableBalance: issuersAvailableBalance } = useBalances(issuer?.address, Chains.Statemine) || {}
  const { availableBalance: freezersAvailableBalance } = useBalances(freezer?.address, Chains.Statemine) || {}

  const adminBalances: [Balance | undefined, AdminAccount][] = [[adminsAvailableBalance, 'Admin'], [issuersAvailableBalance, 'Issuer'], [freezersAvailableBalance, 'Freezer']]

  return adminBalances.flatMap(([balance, role]) => {
    return balance?.lt(EXPECTED_BALANCE) ? role : []
  })
}
