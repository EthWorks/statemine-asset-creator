import { createContext } from 'react'

export interface NewAssetForm {
  assetName: string,
  setAssetName: (arg: string) => void,
  assetId: string,
  setAssetId: (arg: string) => void,
  assetDecimals: string,
  setAssetDecimals: (arg: string) => void,
  assetSymbol: string,
  setAssetSymbol: (arg: string) => void,
}

export const NewAssetModalContext = createContext<NewAssetForm>({
  assetName: '',
  setAssetName: () => {/**/},
  assetId: '',
  setAssetId: () => {/**/},
  assetDecimals: '',
  setAssetDecimals: () => {/**/},
  assetSymbol: '',
  setAssetSymbol: () => {/**/},
})
