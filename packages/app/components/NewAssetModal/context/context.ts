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
  setAssetId: stringSetter,
  assetDecimals: string,
  setAssetDecimals: stringSetter,
  assetSymbol: string,
  setAssetSymbol: stringSetter,
  stringLimit: BN | undefined,
}

export const NewAssetModalContext = createContext<NewAssetForm>({
  assetName: '',
  setAssetName: noop,
  assetNameError: undefined,
  setAssetNameError: noop,
  assetId: '',
  setAssetId: noop,
  assetDecimals: '',
  setAssetDecimals: noop,
  assetSymbol: '',
  setAssetSymbol: noop,
  stringLimit: undefined
})
