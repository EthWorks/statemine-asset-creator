import { Config, KUSAMA_ARCHIVE_NODE_URL, Chains, STATEMINE_ARCHIVE_NODE_URL } from '../src'
import { initializeApi } from '../src/providers/api/initializeApi'

jest.mock('../src/providers/api/useChainApi', () => ({
  useChainApi: () => ({ isConnected: false, connectionState: 'connecting' })
}))

describe('Initialize api for chains', () => {
  beforeEach(function () {
    jest.resetModules()
  })

  it('one network', () => {
    const config: Config = { chains: [{ name: Chains.Kusama, url: KUSAMA_ARCHIVE_NODE_URL }] }
    const networkState = initializeApi(config.chains)
    expect(networkState).toEqual({
      'kusama': { isConnected: false, connectionState: 'connecting' }
    })
  })

  it('multiple networks', () => {
    const config: Config = { chains: [
      { name: Chains.Kusama, url: KUSAMA_ARCHIVE_NODE_URL },
      { name: Chains.Statemine, url: STATEMINE_ARCHIVE_NODE_URL }
    ] }

    const networkState = initializeApi(config.chains)
    expect(networkState).toEqual({
      'kusama': { isConnected: false, connectionState: 'connecting' },
      'statemine': { isConnected: false, connectionState: 'connecting' }
    })
  })
})
