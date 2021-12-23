import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains } from '../consts'
import { countUtf8Bytes } from '../util'
import { useApi } from './useApi'

export function useCreateAssetDeposit(chain: Chains, assetName: string, assetSymbol: string): BN | undefined {
  const { api } = useApi(chain)

  if (!api) return undefined

  const deposit = useMemo(() => {
    const { assetDeposit, metadataDepositBase, metadataDepositPerByte } = api.consts.assets
    const assetNameBytes = countUtf8Bytes(assetName)
    const assetSymbolBytes = countUtf8Bytes(assetSymbol)

    const metadataDeposit = metadataDepositBase.add(metadataDepositPerByte.muln(assetNameBytes + assetSymbolBytes))

    return metadataDeposit.add(assetDeposit)
  }, [api, assetName, assetSymbol])

  return deposit
}
