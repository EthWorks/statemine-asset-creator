import { useContext } from 'react'

import { NewAssetForm, NewAssetModalContext } from './context'

export function useNewAssetModal(): NewAssetForm {
  return useContext(NewAssetModalContext)
}
