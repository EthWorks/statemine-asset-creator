import {createContext, useContext} from "react"
import {ApiPromise} from "@polkadot/api"


export const ApiContext = createContext<{api: ApiPromise} | undefined>({})

export function useApi() {
  return useContext(ApiContext)
}
