import React, { useState } from 'react'

import { Chains, useAssetsConstants } from 'use-substrate'

import { NewAssetModalContext } from './context'

export const NewAssetModalProvider: React.FC = ({  children }) => {
  const [assetName, setAssetName] = useState<string>('')
  const [assetNameError, setAssetNameError] = useState<string>()
  const [assetId, setAssetId] = useState<string>('')
  const [assetDecimals, setAssetDecimals] = useState<string>('')
  const [assetSymbol, setAssetSymbol] = useState<string>('')
  const [assetSymbolError, setAssetSymbolError] = useState<string>()
  const { stringLimit } = useAssetsConstants(Chains.Statemine)

  return <NewAssetModalContext.Provider value={{
    assetName,
    setAssetName,
    assetNameError,
    setAssetNameError,
    assetId,
    setAssetId,
    assetDecimals,
    setAssetDecimals,
    assetSymbol,
    setAssetSymbol,
    assetSymbolError,
    setAssetSymbolError,
    stringLimit
  }}>{children}</NewAssetModalContext.Provider>
}
