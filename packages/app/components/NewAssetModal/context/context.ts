import BN from 'bn.js'
import { createContext } from 'react'

import { Account } from 'use-substrate'

type stringSetter = (arg: string) => void;
type stringOrUndefinedSetter = (arg: string | undefined) => void;
type AccountOrUndefinedSetter = (account: Account | undefined) => void
const noop = (): void => { /**/ }

export interface NewAssetForm {
  admin: Account | undefined,
  setAdmin: AccountOrUndefinedSetter,
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
  assetSymbol: string,
  setAssetSymbol: stringSetter,
  assetSymbolError?: string,
  minBalance: string,
  setMinBalance: stringSetter,
  setAssetSymbolError: stringOrUndefinedSetter,
  stringLimit: BN | undefined,
}

export const NewAssetModalContext = createContext<NewAssetForm>({
  admin: undefined,
  setAdmin: noop,
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
  assetSymbol: '',
  setAssetSymbol: noop,
  assetSymbolError: undefined,
  minBalance: '',
  setMinBalance: noop,
  setAssetSymbolError: noop,
  stringLimit: undefined
})
