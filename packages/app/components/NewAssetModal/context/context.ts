import BN from 'bn.js'
import { createContext } from 'react'

type stringSetter = (arg: string) => void;
type stringOrUndefinedSetter = (arg: string | undefined) => void;
const noop = (): void => {/**/}

export interface NewAssetForm {
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
  setAssetSymbolError: stringOrUndefinedSetter,
  stringLimit: BN | undefined,
}

export const NewAssetModalContext = createContext<NewAssetForm>({
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
  setAssetSymbolError: noop,
  stringLimit: undefined
})
