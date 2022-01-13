import type { Balance } from '@polkadot/types/interfaces'
import type { Account } from 'use-substrate'

import BN from 'bn.js'

import { Chains, useBalances, useChainToken } from 'use-substrate'

type AdminAccount = 'Admin' | 'Issuer' | 'Freezer'

// Unit
const EXPECTED_BALANCE = 0.3

export function useInsufficientAdminBalances(admin: Account | undefined, issuer: Account | undefined, freezer: Account | undefined): AdminAccount[] {
  const { availableBalance: adminsAvailableBalance } = useBalances(admin?.address, Chains.Statemine) || {}
  const { availableBalance: issuersAvailableBalance } = useBalances(issuer?.address, Chains.Statemine) || {}
  const { availableBalance: freezersAvailableBalance } = useBalances(freezer?.address, Chains.Statemine) || {}
  const { chainDecimals } = useChainToken(Chains.Statemine) || {}

  if (chainDecimals === undefined) return []

  const singleToken = new BN(10).pow(new BN(chainDecimals))
  const adminBalances: [Balance | undefined, AdminAccount][] = [[adminsAvailableBalance, 'Admin'], [issuersAvailableBalance, 'Issuer'], [freezersAvailableBalance, 'Freezer']]

  return adminBalances.flatMap(([balance, role]) => {
    return balance?.lt(singleToken.muln(EXPECTED_BALANCE)) ? role : []
  })
}
