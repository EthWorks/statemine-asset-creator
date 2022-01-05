import type { Account } from 'use-substrate'

import React, { useState } from 'react'

import { Chains, useActiveAccount, useAssetsConstants } from 'use-substrate'

import { convertActiveAccountToAccount } from '../../../utils'
import { NewAssetModalContext } from './context'

export const NewAssetModalProvider: React.FC = ({ children }) => {
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const account = convertActiveAccountToAccount(activeAccount)

  const [admin, setAdmin] = useState<Account | undefined>(account)
  const [issuer, setIssuer] = useState<Account | undefined>(account)
  const [freezer, setFreezer] = useState<Account | undefined>(account)
  const [assetName, setAssetName] = useState<string>('')
  const [assetNameError, setAssetNameError] = useState<string>()
  const [assetId, setAssetId] = useState<string>('')
  const [assetIdError, setAssetIdError] = useState<string>()
  const [assetDecimals, setAssetDecimals] = useState<string>('')
  const [assetDecimalsError, setAssetDecimalsError] = useState<string>()
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
    assetDecimalsError,
    setAssetDecimalsError,
    assetSymbol,
    setAssetSymbol,
    assetSymbolError,
    minBalance,
    setMinBalance,
    setAssetSymbolError,
    stringLimit
  }}>{children}</NewAssetModalContext.Provider>
}
