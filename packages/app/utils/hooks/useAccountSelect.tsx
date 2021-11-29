import type { Account, UseAccounts } from 'use-substrate'

import { useEffect, useState } from 'react'

import { Chains, useBalances } from 'use-substrate'

import { BN_ZERO } from '../consts'

interface UseAccountSelect {
  account: Account;
  setAccount: (account: Account) => void;
  accountInfo?: string;
  setAccountInfo: (accountInfo: string | undefined) => void;
  hasFreeBalance?: boolean;
}

export function useAccountSelect(accounts: UseAccounts, chain: Chains): UseAccountSelect {
  const [account, setAccount] = useState<Account>(accounts.allAccounts[0])
  const [accountInfo, setAccountInfo] = useState<string>()
  const { freeBalance } = useBalances(account?.address, chain) || {}
  const hasFreeBalance = freeBalance?.gt(BN_ZERO)

  useEffect(() => {
    setAccount(accounts.allAccounts[0])
  }, [accounts.allAccounts])

  return { account, setAccount, accountInfo, setAccountInfo, hasFreeBalance }
}
