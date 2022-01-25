import type { Account } from 'use-substrate'

import React, { useState } from 'react'

import { useActiveAccount, useAssetsConstants } from 'use-substrate'

import { convertActiveAccountToAccount, useAppChains } from '../../../utils'
import { NewAssetModalContext } from './context'

export const NewAssetModalProvider: React.FC = ({ children }) => {
  const { parachain } = useAppChains()
  const { activeAccount } = useActiveAccount(parachain)
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
  const [assetSymbolError, setAssetSymbolError] = useState<string>()
  const [minBalance, setMinBalance] = useState<string>('')
  const [minBalanceError, setMinBalanceError] = useState<string>()
  const { stringLimit } = useAssetsConstants(parachain)

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
    setAssetSymbolError,
    minBalance,
    setMinBalance,
    minBalanceError,
    setMinBalanceError,
    stringLimit
  }}>{children}</NewAssetModalContext.Provider>
}
