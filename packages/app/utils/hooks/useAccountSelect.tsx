import type { Account, UseAccounts } from 'use-substrate'

import { useState } from 'react'

import { Chains, useBalances } from 'use-substrate'

import { BN_ZERO } from '../consts'

interface UseAccountSelect {
  account: Account | undefined;
  setAccount: (account: Account) => void;
  accountInfo?: string;
  setAccountInfo: (accountInfo: string | undefined) => void;
  hasFreeBalance?: boolean;
}

export function useAccountSelect(accounts: UseAccounts, chain: Chains): UseAccountSelect {
  const [account, setAccount] = useState<Account>()
  const [accountInfo, setAccountInfo] = useState<string>()
  const { freeBalance } = useBalances(account?.address, chain) || {}
  const hasFreeBalance = freeBalance?.gt(BN_ZERO)

  return { account, setAccount, accountInfo, setAccountInfo, hasFreeBalance }
}
