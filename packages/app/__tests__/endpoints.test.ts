import { Chains, defaultChainUrls } from 'use-substrate'
import { assertChainEndpoint } from 'test-helpers'

const chains: Chains[] = [
  Chains.Kusama,
  Chains.Statemine,
  Chains.Polkadot,
  Chains.Statemint
]

describe('--NIGHTLY--checks endpoints', () => {
  chains.forEach((chain) =>
    it(`${chain} @ ${defaultChainUrls[chain]}`, async () => {
      try {
        await assertChainEndpoint(defaultChainUrls[chain])
      } catch (e) {
        throw new Error(JSON.stringify(e))
      }
    }, 8000)
  )
})
