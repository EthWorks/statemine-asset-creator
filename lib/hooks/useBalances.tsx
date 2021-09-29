import { useApi } from "./useApi"
import { useObservable } from "./useObservable"

export function useBalance(address: string) {
  const { api, connectionState } = useApi()

  const balances = useObservable(address ? api?.derive.balances.all(address) : undefined, [api, connectionState, address])

  if (balances === undefined) {
    return null
  }

  return balances
}
