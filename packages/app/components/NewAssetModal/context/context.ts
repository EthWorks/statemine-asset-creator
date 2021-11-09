import { createContext } from 'react'

type stringSetter = (arg: string) => void;
const noop = (): void => {/**/}

export interface NewAssetForm {
  assetName: string,
  setAssetName: stringSetter,
  assetNameError?: string,
  setAssetNameError: stringSetter,
  assetId: string,
  setAssetId: stringSetter,
  assetDecimals: string,
  setAssetDecimals: stringSetter,
  assetSymbol: string,
  setAssetSymbol: stringSetter,
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
})
