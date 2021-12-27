import { Chains } from '../consts'
import { useApi } from './useApi'

interface UseChainToken {
  chainToken: string,
  chainDecimals: number
}

export function useChainToken(chain: Chains): UseChainToken | undefined {
  const { api } = useApi(chain)

  if (!api) return undefined

  const chainDecimals = api.registry.chainDecimals[0]
  const chainToken = api.registry.chainTokens[0]

  return {
    chainToken,
    chainDecimals
  }
}
