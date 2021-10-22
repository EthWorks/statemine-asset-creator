import { Chains, Config, KUSAMA_ARCHIVE_NODE_URL, STATEMINE_ARCHIVE_NODE_URL } from '../src'
import { initializeApi } from '../src/providers/api/initializeApi'

const DEFAULT_API_STATE = { isConnected: false, connectionState: 'connecting' }

jest.mock('../src/providers/api/useChainApi', () => ({
  __esModule: true,
  useChainApi: () => (DEFAULT_API_STATE)
}))

describe('Initialize api for chains', () => {
  it('one network', () => {
    const config: Config = { chains: [{ name: Chains.Kusama, url: KUSAMA_ARCHIVE_NODE_URL }] }
    const networkState = initializeApi(config.chains)
    expect(networkState).toEqual({
      'kusama': DEFAULT_API_STATE
    })
  })

  it('multiple networks', () => {
    const config: Config = { chains: [
      { name: Chains.Kusama, url: KUSAMA_ARCHIVE_NODE_URL },
      { name: Chains.Statemine, url: STATEMINE_ARCHIVE_NODE_URL }
    ] }

    const networkState = initializeApi(config.chains)
    expect(networkState).toEqual({
      'kusama': DEFAULT_API_STATE,
      'statemine': DEFAULT_API_STATE
    })
  })
})
