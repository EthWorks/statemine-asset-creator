import type { Account } from 'use-substrate'

import { useCallback, useEffect, useState } from 'react'

import { Chains, useActiveAccount, useBalances } from 'use-substrate'

import { BN_ZERO } from '../consts'

interface UseAccountSelect {
  account: Account | undefined;
  setAccount: (account: Account | undefined) => void;
  accountInfo?: string;
  setAccountInfo: (accountInfo: string | undefined) => void;
  hasAvailableBalance?: boolean;
  clearData: () => void
}

export function useAccountSelect(chain: Chains): UseAccountSelect {
  const [account, setAccount] = useState<Account>()
  const { activeAccount } = useActiveAccount(chain)
  const [accountInfo, setAccountInfo] = useState<string>()
  const { availableBalance } = useBalances(account?.address, chain) || {}
  const hasAvailableBalance = availableBalance?.gt(BN_ZERO)

  const setCurrentActiveAccount = useCallback((): void => {
    setAccount(
      activeAccount
        ? { address: activeAccount.address.toString(), name: activeAccount.name }
        : undefined
    )
  }, [activeAccount])

  useEffect(() => {
    setCurrentActiveAccount()
  }, [setCurrentActiveAccount])

  return { account, setAccount, accountInfo, setAccountInfo, hasAvailableBalance, clearData: setCurrentActiveAccount }
}
