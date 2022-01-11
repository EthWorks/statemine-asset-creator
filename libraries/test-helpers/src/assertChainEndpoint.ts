import { ApiPromise, WsProvider } from '@polkadot/api'

export async function assertChainEndpoint(endpoint: string): Promise<void> {
  let provider: WsProvider | null = null
  let api: ApiPromise | null = null
  let timerId: NodeJS.Timeout | null = null

  try {
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

export function isError(value: unknown): value is Error {
  return value instanceof Error
}
