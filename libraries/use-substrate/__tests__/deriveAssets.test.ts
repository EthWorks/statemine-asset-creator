import { ApiPromise, ApiRx, WsProvider } from '@polkadot/api'
import { waitFor } from '@testing-library/react'

import { ALICE } from './consts'

describe('derive assets', () => {
  it('updates on create asset event', async () => {
    const apiRx = new ApiRx({ provider: new WsProvider('ws://127.0.0.1:9988') })
    // const api = await ApiPromise.create({ provider: new WsProvider('ws://127.0.0.1:9988') })

    apiRx.isReady.subscribe(() => {
      apiRx.query.assets.asset.keys().subscribe(console.log)
      apiRx.query.system.events()
        .pipe()

      apiRx.tx.assets.create(7, ALICE, 300)
    })

    await waitFor(() => {
      expect(true).toEqual(false)
    }, { timeout: 5000 })
  })
})
