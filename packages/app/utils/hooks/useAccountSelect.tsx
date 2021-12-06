import type { Account, UseAccounts } from 'use-substrate'

import { useEffect, useState } from 'react'

import { Chains, useActiveAccount, useBalances } from 'use-substrate'

import { BN_ZERO } from '../consts'

interface UseAccountSelect {
  account: Account | undefined;
  setAccount: (account: Account | undefined) => void;
  accountInfo?: string;
  setAccountInfo: (accountInfo: string | undefined) => void;
  hasFreeBalance?: boolean;
}

export function useAccountSelect(accounts: UseAccounts, chain: Chains): UseAccountSelect {
  const [account, setAccount] = useState<Account>()
  const { activeAccount: activeAccountId } = useActiveAccount(chain)
  const [accountInfo, setAccountInfo] = useState<string>()
  const { freeBalance } = useBalances(account?.address, chain) || {}
  const hasFreeBalance = freeBalance?.gt(BN_ZERO)

  useEffect(() => {
    const activeAccount = accounts.allAccounts.find((account) => account.address === activeAccountId?.address.toString())

    setAccount(activeAccount)
  }, [accounts.allAccounts, activeAccountId])

  return { account, setAccount, accountInfo, setAccountInfo, hasFreeBalance }
}
