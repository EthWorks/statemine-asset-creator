import type { Balance } from '@polkadot/types/interfaces'
import type { Account } from 'use-substrate'

import BN from 'bn.js'

import { useBalances, useChainToken } from 'use-substrate'

import { useAppChains } from '../../../utils'

type AdminAccount = 'Admin' | 'Issuer' | 'Freezer'

// Unit
const EXPECTED_BALANCE = 0.3

export function useInsufficientAdminBalances(admin: Account | undefined, issuer: Account | undefined, freezer: Account | undefined): AdminAccount[] {
  const { parachain } = useAppChains()
  const { availableBalance: adminsAvailableBalance } = useBalances(admin?.address, parachain) || {}
  const { availableBalance: issuersAvailableBalance } = useBalances(issuer?.address, parachain) || {}
  const { availableBalance: freezersAvailableBalance } = useBalances(freezer?.address, parachain) || {}
  const { chainDecimals } = useChainToken(parachain) || {}

  if (chainDecimals === undefined) return []

  const singleToken = new BN(10).pow(new BN(chainDecimals))
  const adminBalances: [Balance | undefined, AdminAccount][] = [[adminsAvailableBalance, 'Admin'], [issuersAvailableBalance, 'Issuer'], [freezersAvailableBalance, 'Freezer']]

  return adminBalances.flatMap(([balance, role]) => {
    return balance?.lt(singleToken.muln(EXPECTED_BALANCE)) ? role : []
  })
}
