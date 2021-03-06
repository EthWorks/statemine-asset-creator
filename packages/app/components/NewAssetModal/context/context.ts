import type { Account } from 'use-substrate'

import BN from 'bn.js'
import { createContext } from 'react'

type stringSetter = (arg: string) => void;
type stringOrUndefinedSetter = (arg: string | undefined) => void;
type AccountOrUndefinedSetter = (account: Account | undefined) => void
const noop = (): void => { /**/ }

export interface NewAssetForm {
  admin: Account | undefined,
  setAdmin: AccountOrUndefinedSetter,
  issuer: Account | undefined,
  setIssuer: AccountOrUndefinedSetter,
  freezer: Account | undefined,
  setFreezer: AccountOrUndefinedSetter,
  assetName: string,
  setAssetName: stringSetter,
  assetNameError?: string,
  setAssetNameError: stringOrUndefinedSetter,
  assetId: string,
  assetIdError?: string,
  setAssetIdError: stringOrUndefinedSetter,
  setAssetId: stringSetter,
  assetDecimals: string,
  setAssetDecimals: stringSetter,
  assetDecimalsError: string | undefined,
  setAssetDecimalsError: stringOrUndefinedSetter,
  assetSymbol: string,
  setAssetSymbol: stringSetter,
  assetSymbolError?: string,
  setAssetSymbolError: stringOrUndefinedSetter,
  minBalance: string,
  setMinBalance: stringSetter,
  minBalanceError?: string,
  setMinBalanceError: stringOrUndefinedSetter,
  stringLimit: BN | undefined,
}

export const NewAssetModalContext = createContext<NewAssetForm>({
  admin: undefined,
  setAdmin: noop,
  issuer: undefined,
  setIssuer: noop,
  freezer: undefined,
  setFreezer: noop,
  assetName: '',
  setAssetName: noop,
  assetNameError: undefined,
  setAssetNameError: noop,
  assetId: '',
  setAssetId: noop,
  assetIdError: undefined,
  setAssetIdError: noop,
  assetDecimals: '',
  setAssetDecimals: noop,
  assetDecimalsError: undefined,
  setAssetDecimalsError: noop,
  assetSymbol: '',
  setAssetSymbol: noop,
  assetSymbolError: undefined,
  setAssetSymbolError: noop,
  minBalance: '',
  setMinBalance: noop,
  minBalanceError: undefined,
  setMinBalanceError: noop,
  stringLimit: undefined
})
