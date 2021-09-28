import {ApiContext} from "./context"
import {ReactNode, useEffect, useState} from "react"
import {ApiPromise, WsProvider} from "@polkadot/api"

const KUSAMA_ARCHIVE_NODE_URL = 'wss://kusama-rpc.polkadot.io/'

interface Props {
    children: ReactNode
}


export function ApiProvider ({children}: Props) {
  const [api, setApi] = useState<{api: ApiPromise}>()
  // Initialise the provider to connect to the local node
  const provider = new WsProvider(KUSAMA_ARCHIVE_NODE_URL)

  useEffect(() => {
    ApiPromise.create({ provider }).then(api => setApi({api}))
  }, [provider])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
