import { ApiPromise, WsProvider } from '@polkadot/api'
import { fetch } from '@polkadot/x-fetch'

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

export async function assertChainEndpoint(endpoint: string): Promise<void> {
  let provider: WsProvider | null = null
  let api: ApiPromise | null = null
  let timerId: NodeJS.Timeout | null = null

  const [,, host] = endpoint.split('/')
  const response = await fetch(`https://dns.google/resolve?name=${host}`)
  const json = await response.json() as DnsResponse

  try {
    assert(json.Answer, `No DNS entry for ${host}`)

    provider = new WsProvider(endpoint, false)
    api = new ApiPromise({
      provider,
      throwOnConnect: true,
      throwOnUnknown: false
    })

    setTimeout((): void => {
      provider &&
        provider
          .connect()
          .catch(() => undefined)
    }, 1000)

    await Promise.race([
      // eslint-disable-next-line promise/param-names
      new Promise((_, reject): void => {
        timerId = setTimeout((): void => {
          timerId = null
          reject(new Error(`Timeout connecting to ${endpoint}`))
        }, 30_000)
      }),
      api.isReadyOrError
        .then((a) => a.rpc.chain.getBlock())
        .then((b) => console.log(b.toHuman()))
    ])
  } catch (error) {
    console.error(JSON.stringify(error))

    throw error
  } finally {
    if (timerId) {
      clearTimeout(timerId)
    }

    if (provider) {
      try {
        if (api) {
          await api.disconnect()
        } else {
          await provider.disconnect()
        }
      } catch {
        // ignore
      }
    }
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
