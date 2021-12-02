import type { Account } from 'use-substrate'

import React, { useMemo, useState } from 'react'

import { Chains, useAccounts, useActiveAccount, useAssetsConstants } from 'use-substrate'

import { matchAccountIdWithAccountFromExtension } from '../../../utils/matchAccountIdWithAccountFromExtension'
import { NewAssetModalContext } from './context'

export const NewAssetModalProvider: React.FC = ({ children }) => {
  const { activeAccount: activeAccountId } = useActiveAccount(Chains.Statemine)
  const accounts = useAccounts()
  const activeAccount = useMemo(() => matchAccountIdWithAccountFromExtension(activeAccountId, accounts.allAccounts), [activeAccountId, accounts.allAccounts])
  const [admin, setAdmin] = useState<Account | undefined>(activeAccount)
  const [issuer, setIssuer] = useState<Account | undefined>(activeAccount)
  const [freezer, setFreezer] = useState<Account | undefined>(activeAccount)
  const [assetName, setAssetName] = useState<string>('')
  const [assetNameError, setAssetNameError] = useState<string>()
  const [assetId, setAssetId] = useState<string>('')
  const [assetIdError, setAssetIdError] = useState<string>()
  const [assetDecimals, setAssetDecimals] = useState<string>('')
  const [assetSymbol, setAssetSymbol] = useState<string>('')
  const [minBalance, setMinBalance] = useState<string>('')
  const [assetSymbolError, setAssetSymbolError] = useState<string>()
  const { stringLimit } = useAssetsConstants(Chains.Statemine)

  return <NewAssetModalContext.Provider value={{
    admin,
    setAdmin,
    issuer,
    setIssuer,
    freezer,
    setFreezer,
    assetName,
    setAssetName,
    assetNameError,
    setAssetNameError,
    assetId,
    assetIdError,
    setAssetIdError,
    setAssetId,
    assetDecimals,
    setAssetDecimals,
    assetSymbol,
    setAssetSymbol,
    assetSymbolError,
    minBalance,
    setMinBalance,
    setAssetSymbolError,
    stringLimit
  }}>{children}</NewAssetModalContext.Provider>
}
